import React, { useEffect } from 'react';
import Container from '../components/Container/Container';
import * as utils from '../utilities/barchart';
import './Home.css';

const Home = ({ navigation }) => {

    // This will run one time after the component mounts
    useEffect(() => {
        const onPageLoad = () => {
            utils.BarChart("svg");
        };

        // Check if the page has already loaded
        if (document.readyState === 'complete') {
            onPageLoad();
        } else {
            window.addEventListener('load', onPageLoad);
        // Remove the event listener when component unmounts
        return () => window.removeEventListener('load', onPageLoad);
        }
    }, []);

    return (
        <div>
            <Container>
                <div id="tooltip" class="hidden">
                    <p><strong>Bar Value</strong></p>
                    <p><span id="value">100</span></p>
                </div>
                <svg width="600" height="600"></svg>
            </Container >
            <Container>
                <p>Hello</p>
            </Container >
            <Container>
                <p>Hello</p>
            </Container >
        </div>
	);
};

export default Home;
