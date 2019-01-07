import React from 'react';
import { DisplayText, Layout, Icon } from '@shopify/polaris';


const HomePage = () => {
	return (
		<Layout>
			<Layout.Section>
				<DisplayText size="large">Octantis</DisplayText>
			</Layout.Section>
			<Layout.Section>
				<DisplayText size="small">
					Sigma Octantis (σ Octantis, abbreviated Sig Oct, σ Oct), also named Polaris Australis is the current South Star.
				</DisplayText>
			</Layout.Section>
		</Layout>
	)
}

export default HomePage;