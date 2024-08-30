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
} from '@overture-stack/iobio-components/packages/iobio-react-components/';

import Loader from '@/components/Loader';

const percentChartCss = css`
	display: flex;
	width: 100%;
	height: 25vh;
	justify-content: space-evenly;
`;

const histoCss = css`
	height: 40vh;
	margin: 2vh;
`;

const BamTable = () => {
	const theme = useTheme();

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(false);
	}, []);

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
												<IobioPercentBox
													key={key}
													label={displayNames[key]}
													percentKey={key}
													totalKey="total_reads"
												/>
											),
									)}
								</div>
								<div css={histoCss}>
									<IobioCoverageDepth label="Read Coverage" />
								</div>
								{histogramKeys.map((key) => (
									<div css={histoCss} key={key}>
										<IobioHistogram
											brokerKey={key}
											ignoreOutliers={isOutlierKey(key)}
											label={displayNames[key]}
										/>
									</div>
								))}
							</>
						)}
					</>
				</TableContextProvider>
			</article>
		),
		[loading],
	);
};

export default BamTable;
