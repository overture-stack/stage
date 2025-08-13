/*
 *
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import { css, useTheme } from '@emotion/react';
import {
	bamDisplayNames,
	bamKeys,
	type BamContext,
	type BamKey,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';

const getActiveButtonStyles = ({ active }: { active: boolean }) => {
	const {
		colors: { accent, white },
	} = useTheme();
	return `
			background-color: ${active ? white : accent};
			color: ${active ? accent : white};
		`;
};

export const ToggleButtonPanel = ({
	bamContext,
	onToggle,
}: {
	bamContext: BamContext;
	onToggle: (key: BamKey, value: boolean) => void;
}) => {
	const {
		colors: { accent },
	} = useTheme();
	const contextKeys = bamKeys.filter((key) => bamContext.hasOwnProperty(key));
	return (
		<div
			css={css`
				display: flex;
			`}
		>
			<div
				css={css`
					display: inline-flex;
					min-width: fit-content;
					padding-top: 6px;
				`}
			>
				Show / Hide:{' '}
			</div>
			<div
				css={css`
					display: inline-flex;
					flex-wrap: wrap;
				`}
			>
				{contextKeys.map((key) => {
					const active = !!bamContext[key];
					const toggleButtonStyles = getActiveButtonStyles({ active });

					return (
						<button
							css={css`
								display: inline-block;
								border: 2px solid ${accent};
								border-radius: 20px;
								margin: 5px;
								min-width: fit-content;
								padding: 3px 10px;
								${toggleButtonStyles}
							`}
							key={key}
							onClick={() => {
								onToggle(key, active);
							}}
						>
							{bamDisplayNames[key]}
						</button>
					);
				})}
			</div>
		</div>
	);
};
