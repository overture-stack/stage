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
import dynamic from 'next/dynamic';
import { TableContextProvider } from '@overture-stack/arranger-components';
import {
	type BamPercentKey,
	type BamHistogramKey,
	type BamKey,
	type IobioDataBrokerType,
	type IobioCoverageDepthType,
	type IobioHistogramType,
	type IobioPercentBoxType,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';
import Loader from '../../Loader';

const percentChartCss = css`
	display: flex;
	width: 100%;
	height: 25vh;
	justify-content: space-evenly;
`;

const chartCss = css`
	display: inline-flex;
	margin: 10px;
`;

const histoCss = css`
	height: 40vh;
	margin: 2vh;
`;

const IobioDataBroker: IobioDataBrokerType = dynamic(
	() =>
		import('@overture-stack/iobio-components/packages/iobio-react-components/').then(
			(ioBio) => ioBio.IobioDataBroker,
		),
	{ ssr: false },
);

const IobioCoverageDepth: IobioCoverageDepthType = dynamic(
	() =>
		import('@overture-stack/iobio-components/packages/iobio-react-components/').then(
			(ioBio) => ioBio.IobioCoverageDepth,
		),
	{ ssr: false },
);

const IobioHistogram: IobioHistogramType = dynamic(
	() =>
		import('@overture-stack/iobio-components/packages/iobio-react-components/').then(
			(ioBio) => ioBio.IobioHistogram,
		),
	{ ssr: false },
);

const IobioPercentBox: IobioPercentBoxType = dynamic(
	() =>
		import('@overture-stack/iobio-components/packages/iobio-react-components/').then(
			(ioBio) => ioBio.IobioPercentBox,
		),
	{ ssr: false },
);

type BamConstants = {
	displayNames: Partial<Record<BamKey, string>>;
	percentKeys: BamPercentKey[];
	histogramKeys: BamHistogramKey[];
};

const IobioConstants: BamConstants = {
	displayNames: {},
	percentKeys: [],
	histogramKeys: [],
};

const getConstValues = async () => {
	const iobio = await import('@overture-stack/iobio-components/packages/iobio-react-components/');

	const { BamDisplayNames, percentKeys, histogramKeys } = iobio;

	IobioConstants['displayNames'] = BamDisplayNames;
	IobioConstants['percentKeys'] = percentKeys;
	IobioConstants['histogramKeys'] = histogramKeys;
};

const BamTable = () => {
	const theme = useTheme();

	const [BamValues, setBamValues] = useState<BamConstants>(IobioConstants);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getBamValues() {
			await getConstValues();
			setBamValues(IobioConstants);
			setLoading(false);
		}
		getBamValues();
	}, []);

	const { displayNames, percentKeys, histogramKeys } = BamValues;

	return useMemo(
		() => (
			<>
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
						<>
							<IobioDataBroker
								alignmentUrl={'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam'}
							/>
							{loading ? (
								<Loader />
							) : (
								<>
									<div css={percentChartCss}>
										{percentKeys.map(
											(key) =>
												key && (
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
									<div css={histoCss}>
										<IobioCoverageDepth label="Read Coverage" />
									</div>
									{histogramKeys.map((key) => (
										<div css={histoCss} key={key}>
											<IobioHistogram brokerKey={key} label={displayNames[key]} />
										</div>
									))}
								</>
							)}
						</>
					</TableContextProvider>
				</article>
			</>
		),
		[BamValues, loading],
	);
};

export default BamTable;
