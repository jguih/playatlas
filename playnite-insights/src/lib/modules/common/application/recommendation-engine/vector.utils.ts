export class VectorUtils {
	static magnitude = (vector: Float32Array): number => {
		let mag = 0;
		for (let i = 0; i < vector.length; i++) mag += vector[i] * vector[i];
		mag = Math.sqrt(mag);
		return mag;
	};
}
