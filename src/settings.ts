import {
	App,
	PluginSettingTab,
	Setting,
	FuzzySuggestModal,
	TFile,
	TFolder,
} from 'obsidian';
import NoteShortcutPlugin from './main';

export type ShortcutMode = 'note' | 'folder';

export interface ShortcutItem {
	id: string;
	name: string;
	mode: ShortcutMode;
	filePath: string;
	folderPath: string;
}

export class FileSuggestModal extends FuzzySuggestModal<TFile> {
	onChoose: (file: TFile) => void;

	constructor(app: App, onChoose: (file: TFile) => void) {
		super(app);
		this.onChoose = onChoose;
		this.setPlaceholder('Search vault note...');
	}

	getItems(): TFile[] {
		return this.app.vault.getMarkdownFiles();
	}

	getItemText(file: TFile): string {
		return file.path;
	}

	onChooseItem(file: TFile): void {
		this.onChoose(file);
	}
}

export class FolderSuggestModal extends FuzzySuggestModal<TFolder> {
	onChoose: (folder: TFolder) => void;

	constructor(app: App, onChoose: (folder: TFolder) => void) {
		super(app);
		this.onChoose = onChoose;
		this.setPlaceholder('Search vault folder...');
	}

	getItems(): TFolder[] {
		return this.app.vault
			.getAllLoadedFiles()
			.filter((f): f is TFolder => f instanceof TFolder);
	}

	getItemText(folder: TFolder): string {
		return folder.isRoot() ? '/' : folder.path;
	}

	onChooseItem(folder: TFolder): void {
		this.onChoose(folder);
	}
}

export class NoteShortcutSettingTab extends PluginSettingTab {
	plugin: NoteShortcutPlugin;

	constructor(app: App, plugin: NoteShortcutPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	public getSettingDefinitions(): Record<string, unknown>[] {
		return [];
	}

	private persist(refresh: boolean): void {
		void this.plugin.saveSettings().then(() => {
			this.plugin.updateCommands();
			if (refresh) this.display();
		});
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl).setName('Note Shortcuts').setHeading();

		containerEl.createEl('p', {
			text: 'Add custom commands to instantly open a specific note, or the most recently modified note in a folder.',
		});

		new Setting(containerEl)
			.setName('Add New Shortcut')
			.setDesc('Create a new command')
			.addButton((btn) =>
				btn
					.setButtonText('+ Add Shortcut')
					.setCta()
					.onClick(() => {
						this.plugin.settings.shortcuts.push({
							id: Date.now().toString(),
							name: 'New Note Shortcut',
							mode: 'note',
							filePath: '',
							folderPath: '',
						});
						this.persist(true);
					}),
			);

		containerEl.createEl('hr');

		this.plugin.settings.shortcuts.forEach((shortcut, index) => {
			const settingDiv = containerEl.createDiv({
				cls: 'note-shortcut-item',
			});

			settingDiv.setCssStyles({
				marginBottom: '20px',
				padding: '10px',
				border: '1px solid var(--background-modifier-border)',
				borderRadius: '8px',
			});

			new Setting(settingDiv)
				.setName(`Shortcut #${index + 1} Name`)
				.addText((text) =>
					text
						.setPlaceholder('Command Name')
						.setValue(shortcut.name)
						.onChange((value) => {
							shortcut.name = value;
							this.persist(false);
						}),
				);

			new Setting(settingDiv)
				.setName('Type')
				.setDesc('Open a fixed note, or the latest note in a folder')
				.addDropdown((dd) =>
					dd
						.addOption('note', 'Specific note')
						.addOption('folder', 'Latest note in folder')
						.setValue(shortcut.mode)
						.onChange((value) => {
							shortcut.mode = value as ShortcutMode;
							this.persist(true);
						}),
				);

			if (shortcut.mode === 'folder') {
				new Setting(settingDiv)
					.setName('Target Folder')
					.setDesc(
						shortcut.folderPath
							? `Current: ${shortcut.folderPath}`
							: 'No folder selected',
					)
					.addButton((btn) =>
						btn
							.setButtonText(
								shortcut.folderPath
									? 'Change Folder'
									: 'Select Folder',
							)
							.onClick(() => {
								new FolderSuggestModal(
									this.app,
									(folder: TFolder) => {
										shortcut.folderPath = folder.isRoot()
											? '/'
											: folder.path;
										if (
											!shortcut.name ||
											shortcut.name ===
												'New Note Shortcut'
										) {
											shortcut.name = `Open latest in: ${folder.isRoot() ? '/' : folder.name}`;
										}
										this.persist(true);
									},
								).open();
							}),
					);
			} else {
				new Setting(settingDiv)
					.setName('Target Note')
					.setDesc(
						shortcut.filePath
							? `Current: ${shortcut.filePath}`
							: 'No note selected',
					)
					.addButton((btn) =>
						btn
							.setButtonText(
								shortcut.filePath
									? 'Change Note'
									: 'Select Note',
							)
							.onClick(() => {
								new FileSuggestModal(
									this.app,
									(file: TFile) => {
										shortcut.filePath = file.path;
										if (
											!shortcut.name ||
											shortcut.name ===
												'New Note Shortcut'
										) {
											shortcut.name = `Open: ${file.basename}`;
										}
										this.persist(true);
									},
								).open();
							}),
					);
			}

			new Setting(settingDiv).addButton((btn) =>
				btn
					.setButtonText('Delete')
					.setWarning()
					.onClick(() => {
						this.plugin.settings.shortcuts.splice(index, 1);
						this.persist(true);
					}),
			);
		});
	}
}
