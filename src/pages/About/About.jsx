import React from "react";
import './About.scss';
import '../../components/Matchcard/Matchcard'

function About() {
    return (
        <div className="about-us-content">
            <div className="wrapper-about-us">
                <div className="story-container">
                    <div className="line">
                        <div className="dot" />
                        <div className="text">Marzec 2025</div>
                    </div>
                    <div className="connector" />
                    <div className="line">
                        <div className="dot" />
                        <div className="text">4 studentów z pasją...</div>
                    </div>
                    <div className="connector" />
                    <div className="line">
                        <div className="dot" />
                        <div className="text">Wspólny projekt...</div>
                    </div>
                    <div className="connector" />
                    <div className="line">
                        <div className="dot" />
                        <div className="text">ScoreTracker - z miłości do ⚽</div>
                    </div>
                </div>        
            </div>
            <div className="about-us-persons-container">
                <div className="person person1">
                    <div className="photo">
                        <img src="src/assets/placeholder.png" alt="" className="team-photo"/>
                    </div>
                    <div className="facts">
                        <h2>Miłosz</h2>
                        <h3>Frontend Developer</h3>
                        <h3>Fav Team: XD</h3>
                        <p>Fact: Kocham Reacta</p>
                        <p>Kontakt:</p>
                        <p>Will be updated</p>
                    </div>
                </div>
                <div className="person person2">
                <div className="facts right">
                        <h2>Filip</h2>
                        <h3>Frontend Developer</h3>
                        <h3>Fav Team:</h3>
                        <p>Random fakt:</p>
                        <p>Kontakt:</p>
                        <p>Will be updated</p>
                    </div>
                    <div className="photo">
                        <img src="src/assets/placeholder.png" alt="" className="team-photo"/>
                    </div>
                </div>
                <div className="person person3">
                    <div className="photo">
                        <img src="src/assets/placeholder.png" alt="" className="team-photo"/>
                    </div>
                    <div className="facts">
                        <h2>Kuba</h2>
                        <h3>Backend Developer</h3>
                        <h3>Ulubiony zespół:</h3>
                        <p>Random fakt:</p>
                        <p>Kontakt:</p>
                        <p>Will be updated</p>
                    </div>
                </div>
                <div className="person person4">
                    <div className="facts right">
                            <h2>Igor</h2>
                            <h3>Backend Developer</h3>
                            <h3>Ulubiony zespół:</h3>
                            <p>Random fakt:</p>
                            <p>Kontakt:</p>
                            <p>Will be updated</p>
                    </div>
                    <div className="photo">
                        <img src="src/assets/placeholder.png" alt="" className="team-photo"/>
                    </div>
                </div>
            {/*Sekcja przygotowana pod prezentacje osob*/}
            </div>
        </div>
    );
}

export default About;
