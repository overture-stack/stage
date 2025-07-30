/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import React, { useEffect, useState } from 'react';

import { SystemAlert, AlertDef, AlertLevel } from '@/components/SystemAlerts/SystemAlert';
import { getConfig } from '@/global/config';

export const isAlertLevel = (level: any): level is AlertLevel => {
	return level === 'info' || level === 'warning' || level === 'critical';
};

export const isAlertDef = (obj: any): obj is AlertDef => {
	return obj.id && obj.title && obj.dismissible !== undefined && isAlertLevel(obj.level);
};

export const isAlertDefs = (obj: any): obj is AlertDef[] => {
	return Array.isArray(obj) && obj.every(isAlertDef);
};

const LOCAL_STORAGE_KEY = 'SYSTEM_ALERTS_DISMISSED_IDS';

type Props = {
	alerts?: AlertDef[];
};

export const SystemAlerts: React.ComponentType<Props> = ({ alerts }) => {
	const [displayAlerts, setDisplayAlerts] = useState<AlertDef[]>([]);
	const [dismissedIds, setDismissedIds] = useState<string[]>([]);

	const getParsedSystemAlerts = () => {
		try {
			const { NEXT_PUBLIC_SYSTEM_ALERTS } = getConfig();
			const parsed = JSON.parse(NEXT_PUBLIC_SYSTEM_ALERTS);
			if (!isAlertDefs(parsed)) {
				throw new Error('System Alert types are invalid!');
			}
			return parsed;
		} catch (e) {
			console.error('Failed to parse systems alerts! Using empty array!', e);
			return [];
		}
	};

	const systemAlerts = alerts ?? getParsedSystemAlerts();
	const systemAlertIds = systemAlerts.map((a) => a.id);

	const handleClose = (id: string) => {
		const updated = dismissedIds.concat(id).filter((id) => systemAlertIds.includes(id));
		setDisplayAlerts(systemAlerts.filter((a) => !updated.includes(a.id)));
		setDismissedIds(updated);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
	};

	useEffect(() => {
		const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
		setDismissedIds(stored);
		setDisplayAlerts(systemAlerts.filter((a) => !stored.includes(a.id)));
	}, []);

	return (
		<>
			{displayAlerts.map((alert) => (
				<SystemAlert key={alert.id} alert={alert} onClose={() => handleClose(alert.id)} />
			))}
		</>
	);
};
