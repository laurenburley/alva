// tslint:disable:no-bitwise

import { ReactUtils } from '../typescript/react-utils';
import { Slot } from '../../../store/styleguide/slot';
import * as Ts from 'typescript';
import { TypescriptUtils } from '../typescript/typescript-utils';

export class SlotAnalyzer {
	public static analyzeSlots(type: Ts.Type, program: Ts.Program): Slot[] {
		const slots: Slot[] = [];
		const members = type.getApparentProperties();
		const typechecker = program.getTypeChecker();

		members.forEach(memberSymbol => {
			if ((memberSymbol.flags & Ts.SymbolFlags.Property) !== Ts.SymbolFlags.Property) {
				return;
			}

			const declaration = TypescriptUtils.findTypeDeclaration(memberSymbol) as Ts.Declaration;

			const memberType = memberSymbol.type
				? memberSymbol.type
				: declaration && typechecker.getTypeAtLocation(declaration);

			if (!memberType) {
				return;
			}

			if (ReactUtils.isSlotType(program, memberType)) {
				const slot = new Slot(memberSymbol.name);
				slots.push(slot);
			}
		});

		return slots;
	}
}
