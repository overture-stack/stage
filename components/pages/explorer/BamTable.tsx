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

'use client';

import { useMemo, useEffect, useState } from 'react';
import { css, Theme, useTheme } from '@emotion/react';
import { TableContextProvider } from '@overture-stack/arranger-components';
import {
	BamDisplayNames as displayNames,
	BamKeys,
	defaultBamContext,
	histogramKeys,
	IobioCoverageDepth,
	IobioDataBroker,
	IobioHistogram,
	IobioPercentBox,
	isOutlierKey,
	percentKeys,
	type BamContext,
	type BamKey,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';

import Loader from '@/components/Loader';
import { getToggleButtonStyles } from './PageContent';

const BamConfigPanel = ({
	bamContext,
	updateContext,
	theme,
}: {
	bamContext: BamContext;
	updateContext: (key: BamKey, value: boolean) => void;
	theme: Theme;
}) => (
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
			{BamKeys.map((key) => {
				const active = bamContext[key];
				const toggleButtonStyles = getToggleButtonStyles(active, theme);

				return (
					<button
						css={css`
							display: inline-block;
							border: 2px solid ${theme.colors.accent};
							border-radius: 20px;
							margin: 5px;
							min-width: fit-content;
							padding: 3px 10px;
							${toggleButtonStyles}
						`}
						key={key}
						onClick={() => {
							updateContext(key, bamContext[key]);
						}}
					>
						{displayNames[key]}
					</button>
				);
			})}
		</div>
	</div>
);

const BamTable = () => {
	const theme = useTheme();

	const [bamContext, setBamContext] = useState(defaultBamContext);
	const [loading, setLoading] = useState(false);

	// TODO: This will be replaced by File data found in Arranger and passed down through context / parent components
	const fileUrl = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam';
	const fileName = fileUrl.split('/').pop();

	useEffect(() => {
		setLoading(false);
	}, []);

	const updateContext = (key: keyof BamContext, value: boolean) => {
		const newContext = {
			...bamContext,
			[key]: !value,
		};
		setBamContext(newContext);
	};

	return useMemo(
		() => (
			<TableContextProvider>
				<h2>{fileName}</h2>
				<IobioDataBroker alignmentUrl={fileUrl} />
				{loading ? (
					<Loader />
				) : (
					<>
						<BamConfigPanel bamContext={bamContext} updateContext={updateContext} theme={theme} />
						<div
							css={css`
								display: flex;
							`}
						>
							<div
								css={css`
									display: inline-flex;
									flex-direction: column;
									width: 25%;
									justify-content: flex-start;
								`}
							>
								{percentKeys.map(
									(key) =>
										bamContext[key] && (
											<div
												css={css`
													height: 25vh;
													margin: 2vh;
													border: 1px solid ${theme.colors.grey_3};
													padding: 15px;
												`}
												key={key}
											>
												<IobioPercentBox
													label={displayNames[key]}
													percentKey={key}
													totalKey="total_reads"
												/>
											</div>
										),
								)}
							</div>
							<div
								css={css`
									display: inline-flex;
									flex-direction: column;
									width: 75%;
								`}
							>
								{bamContext['coverage_depth'] && (
									<div
										css={css`
											height: 40vh;
											margin: 2vh;
											border: 1px solid ${theme.colors.grey_3};
											padding: 15px;
										`}
									>
										<IobioCoverageDepth label="Read Coverage" />
									</div>
								)}
								{histogramKeys.map(
									(key) =>
										bamContext[key] && (
											<div
												css={css`
													height: 40vh;
													margin: 2vh;
													border: 1px solid ${theme.colors.grey_3};
													padding: 15px;
												`}
												key={key}
											>
												<IobioHistogram
													brokerKey={key}
													ignoreOutliers={isOutlierKey(key)}
													label={displayNames[key]}
												/>
											</div>
										),
								)}
							</div>
						</div>
					</>
				)}
			</TableContextProvider>
		),
		[loading, bamContext],
	);
};

export default BamTable;
