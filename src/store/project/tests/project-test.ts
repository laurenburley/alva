// tslint:disable:no-object-literal-type-assertion

import { Project } from '../project';
import { Store } from '../../store';

describe('Store Project', () => {
	const testData = {
		name: 'name',
		previewFrame: 'previewFrame',
		store: {} as Store
	};
	const project = new Project(testData);

	test('constructor with valid config returns object', () => {
		expect(typeof project).toBe('object');
	});

	test('getId should return a id', () => {
		expect(typeof project.getId()).toBe('string');
	});

	test('constructor with given id should return it', () => {
		const projectWithoutId = new Project({
			...testData,
			id: 'customId'
		});

		expect(projectWithoutId.getId()).toBe('customId');
	});

	test('getName should return given name', () => {
		expect(project.getName()).toBe(testData.name);
	});

	test('getPreviewFrame should given getPreviewFrame', () => {
		expect(project.getPreviewFrame()).toBe(testData.previewFrame);
	});

	test('toJsonObject should return valid json', () => {
		const projectJsonObject = project.toJsonObject();

		expect(projectJsonObject).toEqual({
			name: testData.name,
			previewFrame: testData.previewFrame,
			pages: [],
			uuid: project.getId()
		});
	});

	test('fromJsonObject to create a valid project', () => {
		const projectJsonObject = project.toJsonObject();
		const newProject = Project.fromJsonObject(projectJsonObject, {} as Store);

		expect(newProject).toEqual(project);
	});

	test('setName should rename project', () => {
		const newName = 'new name';
		project.setName(newName);

		expect(project.getName()).toBe(newName);
	});
});
