import React, { useState } from 'react';
import Container from '../components/Container/Container';
import * as utils from '../utilities/barchart';


const Home = ({ navigation }) => {
    return (
        <div>
            <Container>
                <div id="my_dataviz"></div>
                {utils.BarChart("my_dataviz")}
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
