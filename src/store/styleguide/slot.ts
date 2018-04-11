import { Store } from '../../store/store';

export class Slot {
	/**
	 * The technical ID of this slot (e.g. the property name in the TypeScript props interface).
	 */
	private id: string;

	/**
	 * The human-friendly name of the slot.
	 * In the frontend, to be displayed instead of the ID.
	 */
	private name: string;

	public constructor(id: string) {
		this.id = id;
		this.name = Store.guessName(id, name);
	}

	/**
	 * Returns the technical ID of this slot (e.g. the property name in the TypeScript props
	 * interface).
	 * @return The technical ID.
	 */
	public getId(): string {
		return this.id;
	}

	/**
	 * Returns the human-friendly name of the slot.
	 * In the frontend, to be displayed instead of the ID.
	 * @return The human-friendly name of the slot.
	 */
	public getName(): string {
		return this.name;
	}
}
