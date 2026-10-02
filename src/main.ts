import { Plugin, TFile, TAbstractFile, Notice, App } from 'obsidian';
import { NoteShortcutSettingTab, ShortcutItem } from './settings';

export interface PluginSettings {
	shortcuts: ShortcutItem[];
}

const DEFAULT_SETTINGS: PluginSettings = {
	shortcuts: [],
};

export interface AppWithCommands extends App {
	commands: {
		removeCommand(id: string): void;
		executeCommandById(id: string): void;
	};
}

function remapPath(
	path: string,
	oldPath: string,
	newPath: string,
): string | null {
	if (!path) return null;
	if (path === oldPath) return newPath;
	if (path.startsWith(oldPath + '/')) {
		return newPath + path.slice(oldPath.length);
	}
	return null;
}

export default class NoteShortcutPlugin extends Plugin {
	settings!: PluginSettings;
	registeredCommandIds: string[] = [];

	async onload(): Promise<void> {
		await this.loadSettings();

		this.addCommand({
			id: 'go-back-note',
			name: 'Go to Previous Note (Back)',
			icon: 'arrow-left',
			callback: () => {
				(this.app as AppWithCommands).commands.executeCommandById(
					'app:go-back',
				);
			},
		});

		this.addCommand({
			id: 'go-forward-note',
			name: 'Go to Next Note (Forward)',
			icon: 'arrow-right',
			callback: () => {
				(this.app as AppWithCommands).commands.executeCommandById(
					'app:go-forward',
				);
			},
		});

		this.registerEvent(
			this.app.vault.on('rename', (file, oldPath) => {
				void this.handleRename(file, oldPath);
			}),
		);

		this.updateCommands();
		this.addSettingTab(new NoteShortcutSettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		const loadedData =
			(await this.loadData()) as Partial<PluginSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loadedData);

		for (const shortcut of this.settings.shortcuts) {
			shortcut.mode = shortcut.mode ?? 'note';
			shortcut.filePath = shortcut.filePath ?? '';
			shortcut.folderPath = shortcut.folderPath ?? '';
		}
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async handleRename(file: TAbstractFile, oldPath: string): Promise<void> {
		let changed = false;

		for (const shortcut of this.settings.shortcuts) {
			if (shortcut.mode === 'folder') {
				const newPath = remapPath(
					shortcut.folderPath,
					oldPath,
					file.path,
				);
				if (newPath !== null) {
					shortcut.folderPath = newPath;
					changed = true;
				}
			} else {
				const newPath = remapPath(
					shortcut.filePath,
					oldPath,
					file.path,
				);
				if (newPath !== null) {
					if (
						shortcut.filePath === oldPath &&
						file instanceof TFile
					) {
						const oldName = (
							oldPath.split('/').pop() ?? ''
						).replace(/\.md$/, '');
						if (shortcut.name === `Open: ${oldName}`) {
							shortcut.name = `Open: ${file.basename}`;
						}
					}
					shortcut.filePath = newPath;
					changed = true;
				}
			}
		}

		if (changed) {
			await this.saveSettings();
			this.updateCommands();
		}
	}

	updateCommands(): void {
		const appWithCommands = this.app as AppWithCommands;

		for (const id of this.registeredCommandIds) {
			if (
				appWithCommands.commands &&
				typeof appWithCommands.commands.removeCommand === 'function'
			) {
				appWithCommands.commands.removeCommand(id);
			}
		}
		this.registeredCommandIds = [];

		for (const shortcut of this.settings.shortcuts) {
			const isFolder = shortcut.mode === 'folder';
			const target = isFolder ? shortcut.folderPath : shortcut.filePath;
			if (!shortcut.name || !target) continue;

			const cmd = this.addCommand({
				id: `note-shortcut-${shortcut.id}`,
				name: shortcut.name,
				icon: isFolder ? 'folder-open' : 'file-text',
				callback: () => {
					if (isFolder) {
						void this.openLatestInFolder(shortcut.folderPath);
					} else {
						void this.openNote(shortcut.filePath);
					}
				},
			});

			if (cmd) {
				this.registeredCommandIds.push(cmd.id);
			}
		}
	}

	async openNote(filePath: string): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (file && file instanceof TFile) {
			const leaf = this.app.workspace.getLeaf(false);
			await leaf.openFile(file);
		} else {
			new Notice(`Note Shortcut: File not found at "${filePath}"`);
		}
	}

	getLatestFileInFolder(folderPath: string): TFile | null {
		const isRoot = folderPath === '/' || folderPath === '';
		const files = this.app.vault
			.getMarkdownFiles()
			.filter((f) => isRoot || f.path.startsWith(folderPath + '/'));

		let latest: TFile | null = null;
		for (const f of files) {
			if (!latest || f.stat.mtime > latest.stat.mtime) {
				latest = f;
			}
		}
		return latest;
	}

	async openLatestInFolder(folderPath: string): Promise<void> {
		const file = this.getLatestFileInFolder(folderPath);
		if (!file) {
			new Notice(`Note Shortcut: No notes found in "${folderPath}"`);
			return;
		}
		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file);
	}
}
