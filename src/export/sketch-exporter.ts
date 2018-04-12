import * as FileExtraUtils from 'fs-extra';
import Group from '../../../html-sketchapp/build/html2asketch/group';
import nodeToSketchLayers from '../../../html-sketchapp/build/html2asketch/nodeToSketchLayers';
import SketchPage from '../../../html-sketchapp/build/html2asketch/page';
import { Page } from '../store/page/page';
import { Store } from '../store/store';

export class SketchExporter {
	private static elementToSketch(element: HTMLElement): SketchPage {
		const page: SketchPage = nodeToSketchLayers(element);

		if (page) {
			const elementName = element.getAttribute && element.getAttribute('data-name');
			if (this.isNotEmpty(elementName)) {
				page.setName(elementName as string);
			} else {
				page.setName(`(${element.nodeName.toLowerCase()})`);
			}

			Array.from(element.children).forEach(childElement => {
				const childLayer = this.elementToSketch(childElement as HTMLElement);
				if (childLayer) {
					page.addLayer(childLayer);
				}
			});
		}
		return page;
	}

	public static exportToSketch(path: string, element?: HTMLElement): void {
		if (!element) {
			element = document.querySelector('#preview > div > div:nth-child(1)') as HTMLElement;
		}

		const bcr = element.getBoundingClientRect();
		const page = new SketchPage({
			width: bcr.right - bcr.left,
			height: bcr.bottom - bcr.top
		});

		const pageName = (Store.getInstance().getCurrentPage() as Page).getName();
		page.setName(pageName);

		const rootLayer: SketchPage = this.elementToSketch(element);

		const pageGroup = new Group({
			x: rootLayer._x,
			y: rootLayer._y,
			width: rootLayer._width,
			height: rootLayer._height
		});
		pageGroup.setName(pageName);
		page.addLayer(pageGroup);

		pageGroup.addLayer(rootLayer);

		FileExtraUtils.writeFileSync(path, JSON.stringify(page.toJSON(), null, '\t'));
	}

	// tslint:disable-next-line:no-any
	private static isNotEmpty(value: any): boolean {
		return value !== undefined && value !== null && value === '';
	}
}
