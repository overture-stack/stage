export type AlertLevel = 'info' | 'warning' | 'critical';

export const ALERT_LEVELS = {
	info: 'info',
	warning: 'warning',
	critical: 'critical',
} as const;

export type AlertDef = {
	level: AlertLevel;
	title: string;
	message?: string;
	dismissable: boolean;
	id: string;
};

export const isAlertLevel = (level: any): level is AlertLevel => {
	return level === 'info' || level === 'warning' || level === 'critical';
};

export const isAlertDef = (obj: any): obj is AlertDef => {
	return obj.id && obj.title && obj.dismissable !== undefined && isAlertLevel(obj.level);
};

export const isAlertDefs = (obj: any): obj is AlertDef[] => {
	return Array.isArray(obj) && obj.every(isAlertDef);
};
