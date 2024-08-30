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
import { css, useTheme } from '@emotion/react';
import { TableContextProvider } from '@overture-stack/arranger-components';
import {
	IobioCoverageDepth,
	IobioDataBroker,
	IobioHistogram,
	IobioPercentBox,
	BamDisplayNames as displayNames,
	percentKeys,
	histogramKeys,
	isOutlierKey,
	type BamContext,
	type BamKey,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';

import Loader from '@/components/Loader';

const chartColumnCss = css`
	display: inline-flex;
	flex-direction: column;
	width: 25%;
	justify-content: space-evenly;
`;

const chartCss = css`
	height: 20vh;
	margin: 2vh;
`;

const histoColumnCss = css`
	display: inline-flex;
	flex-direction: column;
	width: 70%;
`;

const histoCss = css`
	height: 40vh;
	margin: 2vh;
`;

const defaultBamContext = {
	mapped_reads: true,
	forward_strands: true,
	proper_pairs: true,
	singletons: true,
	both_mates_mapped: true,
	duplicates: true,
	coverage_depth: true,
	coverage_hist: true,
	frag_hist: true,
	length_hist: true,
	mapq_hist: true,
	baseq_hist: true,
} as const;

const bamConfigPanel = (
	bamContext: BamContext,
	updateContext: (key: BamKey, value: boolean) => void,
) => (
	<div style={{ margin: '15px' }}>
		{[...percentKeys, ...histogramKeys].map((key) => {
			return (
				<button
					// className={clsx('config-button', bamContext[key] && 'active')}
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
);

const BamTable = () => {
	const theme = useTheme();

	const [bamContext, setBamContext] = useState(defaultBamContext);

	const [loading, setLoading] = useState(false);

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
			<article
				css={css`
					background-color: ${theme.colors.white};
					border-radius: 5px;
					margin-bottom: 12px;
					padding: 8px;
					${theme.shadow.default};
				`}
			>
				<TableContextProvider>
					<h2>Bam.iobio</h2>
					<IobioDataBroker
						alignmentUrl={'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam'}
					/>
					{loading ? (
						<Loader />
					) : (
						<>
							<span>Show / Hide: </span> {bamConfigPanel(bamContext, updateContext)}
							<div css={chartColumnCss}>
								{percentKeys.map(
									(key) =>
										bamContext[key] && (
											<div css={chartCss} key={key}>
												<IobioPercentBox
													label={displayNames[key]}
													percentKey={key}
													totalKey="total_reads"
												/>
											</div>
										),
								)}
							</div>
							<div css={histoColumnCss}>
								<div css={histoCss}>
									<IobioCoverageDepth label="Read Coverage" />
								</div>
								{histogramKeys.map(
									(key) =>
										bamContext[key] && (
											<div css={histoCss} key={key}>
												<IobioHistogram
													brokerKey={key}
													ignoreOutliers={isOutlierKey(key)}
													label={displayNames[key]}
												/>
											</div>
										),
								)}
							</div>
						</>
					)}
				</TableContextProvider>
			</article>
		),
		[loading],
	);
};

export default BamTable;
