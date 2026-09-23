import {
	App,
	PluginSettingTab,
	Setting,
	FuzzySuggestModal,
	FuzzyMatch,
	setIcon,
	getIconIds,
	TFile,
} from 'obsidian';
import NoteShortcutPlugin from './main';

export interface ShortcutItem {
	id: string;
	name: string;
	filePath: string;
	icon: string;
}

const EXTRA_LUCIDE_ICONS: string[] = [
	'activity',
	'airplay',
	'alarm-clock',
	'alert-circle',
	'alert-octagon',
	'alert-triangle',
	'align-center',
	'align-justify',
	'align-left',
	'align-right',
	'anchor',
	'aperture',
	'archive',
	'arrow-big-down',
	'arrow-big-left',
	'arrow-big-right',
	'arrow-big-up',
	'arrow-down',
	'arrow-down-left',
	'arrow-down-right',
	'arrow-left',
	'arrow-right',
	'arrow-up',
	'arrow-up-left',
	'arrow-up-right',
	'at-sign',
	'award',
	'axe',
	'backpack',
	'badge',
	'banknote',
	'bar-chart',
	'bar-chart-2',
	'bar-chart-3',
	'bar-chart-4',
	'baseline',
	'battery',
	'battery-charging',
	'bell',
	'bell-off',
	'bell-ring',
	'bike',
	'binary',
	'bitcoin',
	'bluetooth',
	'book',
	'book-open',
	'bookmark',
	'box',
	'boxes',
	'briefcase',
	'brush',
	'bug',
	'building',
	'bus',
	'calculator',
	'calendar',
	'camera',
	'candlestick-chart',
	'car',
	'cast',
	'check',
	'check-circle',
	'check-square',
	'chef-hat',
	'chevron-down',
	'chevron-left',
	'chevron-right',
	'chevron-up',
	'chevrons-down',
	'chevrons-left',
	'chevrons-right',
	'chevrons-up',
	'chrome',
	'circle',
	'clapperboard',
	'clipboard',
	'clipboard-check',
	'clipboard-list',
	'clock',
	'cloud',
	'cloud-drizzle',
	'cloud-lightning',
	'cloud-rain',
	'cloud-snow',
	'code',
	'code-2',
	'coffee',
	'cog',
	'coins',
	'columns',
	'command',
	'compass',
	'contact',
	'copy',
	'cpu',
	'credit-card',
	'crop',
	'crosshair',
	'crown',
	'database',
	'delete',
	'diamond',
	'dice-1',
	'dice-5',
	'disc',
	'divide',
	'dollar-sign',
	'download',
	'droplet',
	'drum',
	'ear',
	'edit',
	'edit-2',
	'edit-3',
	'egg',
	'eraser',
	'euro',
	'eye',
	'eye-off',
	'factory',
	'fast-forward',
	'feather',
	'figma',
	'file',
	'file-check',
	'file-code',
	'file-digit',
	'file-input',
	'file-output',
	'file-plus',
	'file-text',
	'files',
	'film',
	'filter',
	'fingerprint',
	'flag',
	'flame',
	'flash-light',
	'folder',
	'folder-minus',
	'folder-plus',
	'folder-tree',
	'frown',
	'fuel',
	'gamepad',
	'gamepad-2',
	'gauge',
	'gavel',
	'gem',
	'ghost',
	'gift',
	'git-branch',
	'git-commit',
	'git-fork',
	'git-merge',
	'git-pull-request',
	'glass-water',
	'globe',
	'glasses',
	'graduational-cap',
	'grid',
	'hammer',
	'hand',
	'hard-drive',
	'hash',
	'headphones',
	'headset',
	'heart',
	'help-circle',
	'history',
	'home',
	'hour-glass',
	'ice-cream',
	'image',
	'inbox',
	'infinity',
	'info',
	'instagram',
	'italic',
	'key',
	'keyboard',
	'laptop',
	'layers',
	'layout',
	'layout-grid',
	'layout-list',
	'life-buoy',
	'lightbulb',
	'link',
	'link-2',
	'linkedin',
	'list',
	'list-ordered',
	'list-todo',
	'loader',
	'lock',
	'log-in',
	'log-out',
	'magnet',
	'mail',
	'map',
	'map-pin',
	'maximize',
	'maximize-2',
	'medal',
	'megaphone',
	'menu',
	'message-circle',
	'message-square',
	'mic',
	'mic-off',
	'minimize',
	'minimize-2',
	'minus',
	'monitor',
	'moon',
	'more-horizontal',
	'more-vertical',
	'mountain',
	'mouse',
	'move',
	'music',
	'navigation',
	'network',
	'newspaper',
	'octagon',
	'package',
	'palette',
	'paperclip',
	'pause',
	'pen-tool',
	'pencil',
	'percent',
	'phone',
	'phone-call',
	'phone-incoming',
	'phone-outgoing',
	'pie-chart',
	'pin',
	'plane',
	'play',
	'plug',
	'plus',
	'plus-circle',
	'plus-square',
	'power',
	'printer',
	'qr-code',
	'radio',
	'receipt',
	'redact',
	'refresh-cw',
	'repeat',
	'reply',
	'rocket',
	'rotate-cw',
	'rss',
	'ruler',
	'save',
	'scale',
	'scan',
	'scissors',
	'screen-share',
	'search',
	'send',
	'server',
	'settings',
	'share',
	'share-2',
	'shield',
	'shield-alert',
	'shield-check',
	'ship',
	'shirt',
	'shopping-bag',
	'shopping-cart',
	'shovel',
	'shower-head',
	'shrink',
	'shuffle',
	'sidebar',
	'signal',
	'skull',
	'slack',
	'slash',
	'sliders',
	'smartphone',
	'smile',
	'snowflake',
	'sparkles',
	'speaker',
	'square',
	'stamp',
	'star',
	'sticker',
	'stop-circle',
	'sun',
	'swords',
	'sword',
	'syringe',
	'table',
	'tablet',
	'tag',
	'target',
	'terminal',
	'thermometer',
	'thumbs-down',
	'thumbs-up',
	'ticket',
	'timer',
	'toggle-left',
	'toggle-right',
	'trash',
	'trash-2',
	'tree-pine',
	'trophy',
	'truck',
	'tv',
	'twitch',
	'twitter',
	'umbrella',
	'underline',
	'unlock',
	'upload',
	'user',
	'user-check',
	'user-minus',
	'user-plus',
	'user-x',
	'users',
	'utensils',
	'video',
	'video-off',
	'voicemail',
	'volume-2',
	'volume-x',
	'wallet',
	'wand',
	'watch',
	'wifi',
	'wind',
	'wrench',
	'youtube',
	'zap',
	'zoom-in',
	'zoom-out',
];

export class IconSuggestModal extends FuzzySuggestModal<string> {
	onChoose: (iconName: string) => void;

	constructor(app: App, onChoose: (iconName: string) => void) {
		super(app);
		this.onChoose = onChoose;
		this.setPlaceholder('Search from 500+ Lucide icons...');
	}

	getItems(): string[] {
		const allIcons = new Set([...getIconIds(), ...EXTRA_LUCIDE_ICONS]);
		return Array.from(allIcons);
	}

	getItemText(item: string): string {
		return item;
	}

	renderSuggestion(item: FuzzyMatch<string>, el: HTMLElement): void {
		super.renderSuggestion(item, el);
		const iconContainer = el.createSpan({ cls: 'suggestion-icon' });

		// תיקון לאזהרת Styles
		iconContainer.setCssStyles({ marginRight: '10px' });

		setIcon(iconContainer, item.item);
		el.prepend(iconContainer);
	}

	onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
		this.onChoose(item);
	}
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

	onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent): void {
		this.onChoose(file);
	}
}

export class NoteShortcutSettingTab extends PluginSettingTab {
	plugin: NoteShortcutPlugin;

	constructor(app: App, plugin: NoteShortcutPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// הוספה של מתודה זו פותרת את אזהרת getSettingDefinitions() של גרסאות אובסידיאן החדשות
	public getSettingDefinitions(): Record<string, unknown>[] {
		return [];
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// תיקון לאזהרת Create Heading
		new Setting(containerEl)
			.setName('Note Shortcuts Settings')
			.setHeading();

		containerEl.createEl('p', {
			text: 'Add custom commands to instantly open specific notes',
		});

		new Setting(containerEl)
			.setName('Add New Shortcut')
			.setDesc('Create a new command for a specific note')
			.addButton((btn) =>
				btn
					.setButtonText('+ Add Shortcut')
					.setCta()
					.onClick(() => {
						this.plugin.settings.shortcuts.push({
							id: Date.now().toString(),
							name: 'New Note Shortcut',
							filePath: '',
							icon: 'file-text',
						});

						// תיקון לאזהרת "misused promise" בחתימת אירועים
						void this.plugin.saveSettings().then(() => {
							this.plugin.updateCommands();
							this.display();
						});
					}),
			);

		containerEl.createEl('hr');

		this.plugin.settings.shortcuts.forEach((shortcut, index) => {
			const settingDiv = containerEl.createDiv({
				cls: 'note-shortcut-item',
			});

			// תיקון לאזהרת no-static-styles-assignment
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
							// תיקון promise
							void this.plugin.saveSettings().then(() => {
								this.plugin.updateCommands();
							});
						}),
				);

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
							shortcut.filePath ? 'Change Note' : 'Select Note',
						)
						.onClick(() => {
							new FileSuggestModal(this.app, (file: TFile) => {
								shortcut.filePath = file.path;
								if (
									!shortcut.name ||
									shortcut.name === 'New Note Shortcut'
								) {
									shortcut.name = `Open: ${file.basename}`;
								}
								void this.plugin.saveSettings().then(() => {
									this.plugin.updateCommands();
									this.display();
								});
							}).open();
						}),
				);

			new Setting(settingDiv)
				.setName('Command Icon')
				.setDesc('Click to choose from 500+ Lucide icons')
				.addButton((btn) => {
					btn.setButtonText(shortcut.icon || 'file-text');
					btn.setIcon(shortcut.icon || 'file-text');
					btn.onClick(() => {
						new IconSuggestModal(this.app, (iconName: string) => {
							shortcut.icon = iconName;
							void this.plugin.saveSettings().then(() => {
								this.plugin.updateCommands();
								this.display();
							});
						}).open();
					});
				})
				.addButton((btn) =>
					btn
						.setButtonText('Delete')
						.setWarning()
						.onClick(() => {
							this.plugin.settings.shortcuts.splice(index, 1);
							void this.plugin.saveSettings().then(() => {
								this.plugin.updateCommands();
								this.display();
							});
						}),
				);
		});
	}
}
