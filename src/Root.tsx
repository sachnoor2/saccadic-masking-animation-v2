import React from 'react';
import { Composition } from 'remotion';
import { SaccadicViral } from './Saccadic_VIRAL';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Saccadic"
				component={SaccadicViral}
				durationInFrames={2700}
				fps={60}
				width={1080}
				height={1920}
			/>
		</>
	);
};
