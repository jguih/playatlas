import type {
	IFileSystemServicePort,
	ILogServicePort,
	ISignatureServicePort,
} from "@playatlas/common/application";
import { createVerify, sign as cryptoSign, generateKeyPairSync } from "crypto";
import { join } from "path";
import type { SystemConfig } from "../infra";

export type SignatureServiceDeps = {
	fileSystemService: IFileSystemServicePort;
	logService: ILogServicePort;
	getSecurityDir: SystemConfig["getSecurityDir"];
};

export const makeSignatureService = ({
	fileSystemService,
	logService,
	getSecurityDir,
}: SignatureServiceDeps): ISignatureServicePort => {
	const keysDir = join(getSecurityDir(), "/keys");
	const publicKeyPath = join(keysDir, "public-key.der");
	const privateKeyPath = join(keysDir, "private-key.der");

	const generateAsymmetricKeyPair: ISignatureServicePort["generateAsymmetricKeyPair"] =
		async () => {
			logService.debug(`Generating asymmetric keys...`);

			try {
				await fileSystemService.access(publicKeyPath);
				await fileSystemService.access(privateKeyPath);
				logService.debug(`Skipping asymmetric key generation, both keys already exist`);
				return;
			} catch {
				logService.info(`Asymmetric keys do not exist, generating new pair`);
			}

			await fileSystemService.mkdir(keysDir, { recursive: true });
			const { publicKey, privateKey } = generateKeyPairSync("rsa", {
				modulusLength: 4096,
				publicKeyEncoding: { type: "spki", format: "der" },
				privateKeyEncoding: { type: "pkcs8", format: "der" },
			});
			await fileSystemService.writeFile(publicKeyPath, publicKey, {
				encoding: "utf-8",
			});
			await fileSystemService.writeFile(privateKeyPath, privateKey, {
				encoding: "utf-8",
			});
			logService.success(`Asymmetric keys created successfully`);
		};

	const sign: ISignatureServicePort["sign"] = async (data) => {
		const buffer = Buffer.from(data);
		const privKey = await fileSystemService.readfile(privateKeyPath);
		const signature = cryptoSign("sha256", buffer, {
			key: privKey,
			format: "der",
			type: "pkcs8",
		});
		return signature.toString("base64");
	};

	const verify: ISignatureServicePort["verify"] = ({ publicKey, payload, signature }) => {
		const verify = createVerify("sha256");
		verify.update(payload);
		verify.end();
		return verify.verify(publicKey, Buffer.from(signature, "base64"));
	};

	return {
		generateAsymmetricKeyPair,
		sign,
		verify,
	};
};
