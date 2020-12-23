import React, {Component} from 'react';
import {Panel, PanelHeader} from '@vkontakte/vkui';
import {getMessage} from '../../js/helpers';
import MeetListAdmin from '../MeetList/MeetListAdmin';

import '@vkontakte/vkui/dist/vkui.css';
import '../../panels/Home.css';

class AdminPage extends Component {
    render() {
        return (
            <Panel id={this.props.id}>
                <PanelHeader>{getMessage('admin_panel_title')}</PanelHeader>
                <MeetListAdmin
                    {...this.props}
                    meets={this.props.allMeets}
                    setParentState={this.props.setParentState}
                />
            </Panel>
        );
    }
}

export default AdminPage;
