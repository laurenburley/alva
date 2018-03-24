// tslint:disable:no-object-literal-type-assertion

import { PageRef } from '../page-ref';
import { Project } from '../project';
import { Store } from '../../store';

describe('Store PageRef', () => {
	const testData = {
		path: 'path',
		project: new Project({
			name: 'name',
			previewFrame: 'previewFrame',
			store: {} as Store
		}),
		store: {} as Store
	};

	const extendedTestData = {
		...testData,
		id: 'customID',
		name: 'customName',
		path: 'customPath'
	};

	const pageRef = new PageRef(testData);
	const pageRefWithExtendedData = new PageRef(extendedTestData);

	test('constructor with valid config returns object', () => {
		expect(typeof pageRef).toBe('object');
	});

	test('getId should return a id', () => {
		expect(typeof pageRef.getId()).toBe('string');
	});

	test('constructor with given id should return it', () => {
		expect(pageRefWithExtendedData.getId()).toBe('customID');
	});

	test('getName should return a string', () => {
		expect(typeof pageRef.getName()).toBe('string');
	});

	test('constructor with given id should return it', () => {
		expect(pageRefWithExtendedData.getName()).toBe('customName');
	});

	test('getPath should return a string', () => {
		expect(typeof pageRef.getPath()).toBe('string');
	});

	test('constructor with given path should return it', () => {
		expect(pageRefWithExtendedData.getPath()).toBe('customPath');
	});

	test('getProject should return the given project', () => {
		expect(pageRef.getProject()).toBe(testData.project);
	});

	test('toJsonObject should return valid json', () => {
		const pageRefJsonObject = pageRefWithExtendedData.toJsonObject();

		expect(pageRefJsonObject).toEqual({
			name: extendedTestData.name,
			path: extendedTestData.path,
			uuid: extendedTestData.id
		});
	});

	test('fromJsonObject to create a valid pageRef', () => {
		const pageRefJsonObject = pageRefWithExtendedData.toJsonObject();
		const newPageRef = PageRef.fromJsonObject(pageRefJsonObject, testData.project, {} as Store);

		expect(newPageRef).toEqual(pageRefWithExtendedData);
	});

	test('setName should rename project', () => {
		const newName = 'new name';
		pageRef.setName(newName);

		expect(pageRef.getName()).toBe(newName);
	});

	test('setPath should rename project', () => {
		const newPath = 'new/path';
		pageRef.setPath(newPath);

		expect(pageRef.getPath()).toBe(newPath);
	});

	test('setProject should rename project', () => {
		const newProject = new Project({
			name: 'name',
			previewFrame: 'previewFrame',
			store: {} as Store
		});
		pageRef.setProject(newProject);

		expect(pageRef.getProject()).toBe(newProject);
	});
});
