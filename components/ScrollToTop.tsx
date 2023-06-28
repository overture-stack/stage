/*
 *
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
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

import { ReactNode, useRef } from 'react';
import { useTheme, css } from '@emotion/react';

const ScrollToTopButton = ({
	bottomOffset,
	leftOffset,
	onClick,
}: {
	bottomOffset: number;
	leftOffset: number;
	onClick: () => void;
}) => {
	const theme = useTheme();
	const buttonDiameter = 30;

	return (
		<div
			css={css`
				position: fixed;
				bottom: ${bottomOffset + 10}px;
				left: ${leftOffset - buttonDiameter - 20}px;
			`}
		>
			<button
				css={css`
					border-radius: 50%;
					background: ${theme.colors.accent};
					border: 0 none;
					width: ${buttonDiameter}px;
					height: ${buttonDiameter}px;
					display: float;
					align-items: center;
					justify-content: center;
					line-height: 1;
					color: ${theme.colors.white};
					box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
					cursor: pointer;
					&:hover {
						background: ${theme.colors.accent_dark};
					}
				`}
				onClick={onClick}
			>
				<img src="images/white_arrow.svg" width={16} alt="Scroll to top" />
			</button>
		</div>
	);
};

const ScrollToTop = ({
	children,
	buttonBottomOffset,
	buttonLeftOffset,
}: {
	children: ReactNode;
	buttonBottomOffset: number;
	buttonLeftOffset: number;
}) => {
	const scrollRef = useRef<null | HTMLDivElement>(null);
	const executeScroll = () => scrollRef?.current?.scrollIntoView();

	return (
		<>
			<div className="scroll-top-ref" ref={scrollRef} />
			{children}
			<ScrollToTopButton
				bottomOffset={buttonBottomOffset}
				leftOffset={buttonLeftOffset}
				onClick={executeScroll}
			/>
		</>
	);
};

export default ScrollToTop;
