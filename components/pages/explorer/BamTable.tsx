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

import { useMemo } from 'react';
import { css, useTheme } from '@emotion/react';
import dynamic from 'next/dynamic';
import { TableContextProvider } from '@overture-stack/arranger-components';
import {
	BamDisplayNames,
	BamKeys,
	type IobioDataBrokerType,
	type IobioCoverageDepthType,
	type IobioHistogramType,
	type IobioPercentBoxType,
} from '@overture-stack/iobio-components/packages/iobio-react-components/';

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

const BamTable = () => {
	const theme = useTheme();

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
							<div css={percentChartCss}>
								<div css={chartCss}>
									<IobioPercentBox
										label="Mapped Reads"
										percentKey="mapped_reads"
										totalKey="total_reads"
										key="mapped_reads"
									/>
								</div>
								<div css={chartCss}>
									<IobioPercentBox
										label={'Forward Strands'}
										percentKey={'forward_strands'}
										totalKey="total_reads"
										key={'forward_strands'}
									/>
								</div>
								<div css={chartCss}>
									<IobioPercentBox
										label={'Proper Pairs'}
										percentKey={'proper_pairs'}
										totalKey="total_reads"
										key={'proper_pairs'}
									/>
								</div>
								<div css={chartCss}>
									<IobioPercentBox
										label={'Singletons'}
										percentKey={'singletons'}
										totalKey="total_reads"
										key={'singletons'}
									/>
								</div>
								<div css={chartCss}>
									<IobioPercentBox
										label={'Both Mates Mapped'}
										percentKey={'both_mates_mapped'}
										totalKey="total_reads"
										key={'both_mates_mapped'}
									/>
								</div>
								<div css={chartCss}>
									<IobioPercentBox
										label={'Duplicates'}
										percentKey={'duplicates'}
										totalKey="total_reads"
										key={'duplicates'}
									/>
								</div>
							</div>
							<div css={histoCss}>
								<IobioCoverageDepth label="Read Coverage" />
							</div>
							<div css={histoCss}>
								<IobioHistogram
									key={'baseq_hist'}
									brokerKey={'baseq_hist'}
									label={'Base Quality'}
								/>
							</div>
						</>
					</TableContextProvider>
				</article>
			</>
		),
		[],
	);
};

export default BamTable;
