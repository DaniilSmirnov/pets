import React, {Component} from 'react';
import {
    Panel, PanelHeader, PanelHeaderBack, Spinner, IS_PLATFORM_IOS, Div
} from '@vkontakte/vkui';
import {
    Map, Placemark, YMaps, ZoomControl
} from 'react-yandex-maps';

import '@vkontakte/vkui/dist/vkui.css';
import '../../panels/Home.css';

class MapPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            points: false,
            mapLoad: false
        }
    }

    componentDidMount() {
        this.props.api.GetGeoPosition(this.props.state.meet.id).then(points => {
            this.setState({points});
        })
    }

    render() {

        const {id, setParentState} = this.props;

        if (!this.state.points || !this.props.state.userGeo) {
            return (
                <Panel id={id}>
                    <PanelHeader
                        left={<PanelHeaderBack onClick={() => setParentState({
                            activePanel: 'meet'
                        })}/>}
                    >
                        Карта
                    </PanelHeader>
                    <Div>
                        <Spinner/>
                    </Div>
                </Panel>
            )
        }

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => setParentState({
                        activePanel: 'meet'
                    })}/>}
                >
                    Карта
                </PanelHeader>
                {
                    !this.state.mapLoad &&
                    <Div>
                        <Spinner/>
                    </Div>
                }
                <YMaps>
                    <Map
                        onLoad={() => {
                            this.setState({
                                mapLoad: true
                            })
                        }}
                        className={IS_PLATFORM_IOS ? 'MapsCssIOS' : 'MapsCssAndroid'}
                        defaultState={{
                            center: this.props.state.userGeo,
                            zoom: 5,
                        }}
                    >
                        {
                            this.state.points.map((e, i) => (
                                <Placemark
                                    key={i}
                                    geometry={[e.lat, e.lon]}
                                />
                            ))
                        }
                        <ZoomControl options={{float: 'right'}}/>
                    </Map>
                </YMaps>
            </Panel>
        );
    }
}

export default MapPage;
