import React, {Component} from 'react';
import {Panel, PanelHeader, PanelHeaderButton, PullToRefresh, PromoBanner} from '@vkontakte/vkui';
import {getMessage} from '../js/helpers';
import MeetList from '../components/MeetList/MeetList';

import Icon28UsersOutline from '@vkontakte/icons/dist/28/users_outline';
import '@vkontakte/vkui/dist/vkui.css';
import './Home.css';

class Home extends Component {

    render() {
        const {id, setParentState, banner} = this.props;
        console.log(banner)
        return (
            <Panel id={id}>
                <PanelHeader left={
                    <PanelHeaderButton onClick={() => setParentState({activePanel: 'comm'})}>
                        <Icon28UsersOutline width={24} height={24}/>
                    </PanelHeaderButton>
                }>
                    {getMessage('home_panel_title')}
                </PanelHeader>

                {banner &&
                <PromoBanner
                    style={{
                        outline: 'none'
                    }}
                    onClose={() => {
                        setParentState({
                            banner: false
                        })
                    }}
                    bannerData={banner}
                />}
                <PullToRefresh
                    onRefresh={this.props.getMeets}
                    isFetching={this.props.state.fetching}>

                    <MeetList
                        {...this.props}
                        {...this}
                        state={this.props.state}
                        api={this.props.api}
                        meets={this.props.meets}
                        setParentState={setParentState}
                    />
                </PullToRefresh>
                {this.props.state.snackbar}
            </Panel>
        );
    }
}

export default Home;
