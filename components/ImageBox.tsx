import React from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';

type ImageSize = 'lg' | 'md' | 'sm';

const IMAGE_SIZES = {
	LG: 'lg' as ImageSize,
	MD: 'md' as ImageSize,
	SM: 'sm' as ImageSize,
};

const getContainerStyles = (size: ImageSize) =>
	({
		[IMAGE_SIZES.LG]: `
    padding: 1rem 2rem;
    line-height: 26px;
 `,
		[IMAGE_SIZES.MD]: `
    padding: 1rem;
    line-height: 24px;
 `,
		[IMAGE_SIZES.SM]: `
    padding: 0.5rem;
    line-height: 20px;
    display: flex;
    align-items: center;
 `,
	}[size]);

const ImageContentContainer = styled('div')<{ size: ImageSize }>`
	${({ theme, size }) => css`
		border: 1px solid ${theme.colors.grey_1};
		border-radius: 5px;
		${theme.shadow.default};
		${theme.typography.subheading};
		font-weight: normal;
		background-color: ${theme.colors.grey_1};
		color: ${theme.colors.accent_dark};
		${getContainerStyles(size)};
		max-width: 75%;
	`}
`;

const ImageTitle = styled('h1')`
	${({ size }: { size: ImageSize }) => css`
		display: flex;
		align-items: center;
		margin: 0.5rem 0 1rem;
		font-size: 24px;
		line-height: 38px;
	`}
`;

const StyledImage = styled.img`
	width: 100%;
	height: auto;
	object-fit: cover;
`;

const ImageBox = ({
	children,
	className,
	title,
	size,
	imageSrc,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	title?: string;
	size: ImageSize;
	imageSrc?: string;
	styles?: string;
}) => {
	const theme = useTheme();

	return (
		<div
			className={className}
			css={css`
				display: flex;
				flex: 1;
			`}
		>
			<ImageContentContainer size={size}>
				{title && <ImageTitle size={size}>{title}</ImageTitle>}
				{imageSrc && <StyledImage src={imageSrc} alt="descriptive text" />}
				<div>{children}</div>
			</ImageContentContainer>
		</div>
	);
};

export default ImageBox;
