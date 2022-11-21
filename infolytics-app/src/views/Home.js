import React, { useState } from 'react';
import Container from '../components/Container/Container';
import * as d3 from d3;

const Home = ({ navigation }) => {
    return (
        <div>
            <Container>
                {
                d3.csv("marksheet.csv").then(function (data) {
                    xScale.domain( 
                        data.map(function (d) { 
                            return d.name; 
                        }) 
                    );
                    yScale.domain([ 
                        0, 
                        d3.max(data, function (d) { 
                            return d.marks; 
                        }), 
                    ]); 
                })
                }
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
