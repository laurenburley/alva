import { elementMenu } from '../../electron/context-menus';
import { ElementLocationCommand } from '../../store/command/element-location-command';
import { ElementWrapper } from './element-wrapper';
import { ListItemProps } from '../../lsg/patterns/list';
import { createMenu } from '../../electron/menu';
import { observer } from 'mobx-react';
import { Page } from '../../store/page/page';
import { PageElement } from '../../store/page/page-element';
import { Pattern } from '../../store/styleguide/pattern';
import * as React from 'react';
import { Store } from '../../store/store';

@observer
export class ElementList extends React.Component {
	public componentDidMount(): void {
		createMenu();
	}

	public componentWillUpdate(): void {
		createMenu();
	}

	public createItemFromElement(
		key: string,
		element: PageElement,
		selectedElement?: PageElement
	): ListItemProps {
		const pattern: Pattern | undefined = element.getPattern();
		if (!pattern) {
			return {
				label: key,
				value: '(invalid)',
				children: []
			};
		}

		let defaultSlot: ListItemProps = {
			value: ''
		};

		const slots: ListItemProps[] = pattern.getSlots().map(slot => {
			const children: PageElement[] = element.getChildren(slot.getId()) || [];
			const childItems: ListItemProps[] = [];

			children.forEach((value: PageElement, index: number) => {
				childItems.push(
					this.createItemFromElement(
						children.length > 1 ? `Child ${index + 1}` : 'Child',
						value,
						selectedElement
					)
				);
			});

			const slotListItem: ListItemProps = {
				value: `🔘 ${slot.getName()}`,
				draggable: false,
				children: childItems
			};

			if (slot.getId() === 'default') {
				defaultSlot = slotListItem;
			}

			return slotListItem;
		});

		slots.splice(slots.indexOf(defaultSlot), 1);
		if (defaultSlot.children) {
			slots.push(...defaultSlot.children);
		}

		const updatePageElement: React.MouseEventHandler<HTMLElement> = event => {
			event.stopPropagation();
			Store.getInstance().setSelectedElement(element);
			Store.getInstance().setElementFocussed(true);
		};

		return {
			label: key,
			value: element.getName(),
			onClick: updatePageElement,
			onContextMenu: () => elementMenu(element),
			handleDragStart: (e: React.DragEvent<HTMLElement>) => {
				Store.getInstance().setDraggedElement(element);
			},
			handleDragDropForChild: (e: React.DragEvent<HTMLElement>) => {
				const patternId = e.dataTransfer.getData('patternId');

				const newParent = element.getParent();
				let draggedElement: PageElement | undefined;

				const store = Store.getInstance();
				if (!patternId) {
					draggedElement = store.getDraggedElement();
				} else {
					const styleguide = store.getStyleguide();
					if (!styleguide) {
						return;
					}

					draggedElement = new PageElement({
						pattern: styleguide.getPattern(patternId),
						setDefaults: true
					});
				}

				if (!newParent || !draggedElement || draggedElement.isAncestorOf(newParent)) {
					return;
				}

				let newIndex = element.getIndex();
				if (draggedElement.getParent() === newParent) {
					const currentIndex = draggedElement.getIndex();
					if (newIndex > currentIndex) {
						newIndex--;
					}
					if (newIndex === currentIndex) {
						return;
					}
				}

				store.execute(
					ElementLocationCommand.addChild(newParent, draggedElement, undefined, newIndex)
				);
				store.setSelectedElement(draggedElement);
			},
			handleDragDrop: (e: React.DragEvent<HTMLElement>) => {
				const patternId = e.dataTransfer.getData('patternId');

				let draggedElement: PageElement | undefined;

				const store = Store.getInstance();
				if (!patternId) {
					draggedElement = store.getDraggedElement();
				} else {
					const styleguide = store.getStyleguide();

					if (!styleguide) {
						return;
					}

					draggedElement = new PageElement({
						pattern: styleguide.getPattern(patternId),
						setDefaults: true
					});
				}

				if (!draggedElement || draggedElement.isAncestorOf(element)) {
					return;
				}

				store.execute(ElementLocationCommand.addChild(element, draggedElement));
				store.setSelectedElement(draggedElement);
			},
			children: slots,
			active: element === selectedElement
		};
	}

	public render(): JSX.Element | null {
		const store = Store.getInstance();
		const page: Page | undefined = store.getCurrentPage();
		if (page) {
			const rootElement = page.getRoot();

			if (!rootElement) {
				return null;
			}

			const selectedElement = store.getSelectedElement();

			return this.renderList(this.createItemFromElement('Root', rootElement, selectedElement));
		} else {
			return null;
		}
	}

	public renderList(item: ListItemProps, key?: number): JSX.Element {
		return (
			<ElementWrapper
				title={item.value}
				key={key}
				handleClick={item.onClick}
				handleContextMenu={item.onContextMenu}
				active={item.active}
				handleDragStart={item.handleDragStart}
				handleDragDropForChild={item.handleDragDropForChild}
				handleDragDrop={item.handleDragDrop}
			>
				{item.children &&
					item.children.length > 0 &&
					item.children.map((child, index) => this.renderList(child, index))}
			</ElementWrapper>
		);
	}
}
