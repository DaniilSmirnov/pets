import React, {Component} from 'react';
import {ActionSheet, ActionSheetItem, IS_PLATFORM_IOS, Link} from '@vkontakte/vkui/';

import bridge from '@vkontakte/vk-bridge';

import Icon28MoreHorizontal from '@vkontakte/icons/dist/28/more_horizontal';
import {shortNumber} from '../../js/helpers';
import './MeetBox.css'

class MeetBox extends Component {
    goMeet = () => {
        const {meet, setParentState} = this.props;
        bridge.send('VKWebAppEnableSwipeBack');
        setParentState !== null &&
        setParentState({
            meet: meet,
            activePanel: 'meet'
        });
    };
    openActionSheet = (e) => {
        e.stopPropagation();
        const {meet, api, setParentState} = this.props;
        const removeMeetMember = e => {
            const {state, getUserMeets, isFave, getOwneredMeets, getExpiredUserMeets, getMeets} = this.props.props;
            const fetchedUser = state.fetchedUser;
            api.RemoveMeetMember({
                meet: meet.id
            }).then(res => {
                if (isFave) {
                    let activeTab = state.activeTab
                    if (activeTab === 'all') {
                        getUserMeets(fetchedUser.id);
                    } else if (activeTab === 'my') {
                        getOwneredMeets(fetchedUser.id);
                    } else if (activeTab === 'exp') {
                        getExpiredUserMeets(fetchedUser.id);
                    }
                } else {
                    getMeets(fetchedUser.id)
                }
            });
        };
        setParentState !== null &&
        setParentState({
            popout:
                <ActionSheet onClose={() => setParentState({popout: null})}>
                    <ActionSheetItem onClick={this.goMeet} autoclose>
                        Перейти на страницу петиции
                    </ActionSheetItem>
                    {meet.ismember &&
                    <ActionSheetItem onClick={() => this.props.makeStory(meet.id)} autoclose>
                        Поделиться в истории
                    </ActionSheetItem>}
                    {meet.ismember &&
                    <ActionSheetItem onClick={() => removeMeetMember()} autoclose mode="destructive">
                        Отказаться от участия
                    </ActionSheetItem>}
                    {IS_PLATFORM_IOS && <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                </ActionSheet>,
        });
    };

    render() {
        const {meet, restProps} = this.props;
        return (
            <div style={{
                marginBottom: 10
            }} onClick={this.goMeet} {...restProps}>
                <div
                    className='bigImage'
                  /*  onClick={() => {
                        if(this.props.onMeet){
                            bridge.send("VKWebAppShowImages", {
                                images: [
                                    `url(${meet.photo})`
                                ]
                            });
                        }
                    }}*/
                     style={{
                         backgroundImage: `url(${meet.photo})`,
                     }}
                />
                <div className={this.props.state === 'bright_light' ? 'newsDiv shadowL' : 'newsDiv shadowD'}>
                    <div style={{minWidth: 0}}>
                        <div
                            className='meetSubtitle'
                            style={{color: 'var(--accent)'}}
                        >
                            <Link
                                href={this.props.onMeet &&
                                `https://vk.com/${meet.ownerid < 0 ? `club${-meet.ownerid}` : `id${meet.ownerid}`}`
                                }
                                target='_blank'
                            >
                                {
                                    this.props.onAdd ?
                                       <div>{this.props.onAdd}</div>
                                        :
                                      <div>{meet.owner_name + " " + (meet.owner_surname || '')}</div>
                                }
                            </Link>
                        </div>
                        <div className='meetTitle' style={{marginTop: 6}}>
                            {meet.name}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', marginTop: 6}}>
                            <div className='meetSubtitle'>
                                {shortNumber(meet.members_amount)}
                            </div>
                            <div className='meetSubtitle' style={{
                                marginLeft: 12,
                                color: !meet.ismember ? 'var(--text_secondary)' : 'var(--button_commerce_background)'
                            }}>
                                {!meet.ismember ? "Вы не участвуете" : "Вы участвуете"}
                            </div>
                        </div>
                    </div>
                    {
                        !this.props.onMeet &&
                        <div style={{marginLeft: 'auto'}}>
                            <Icon28MoreHorizontal
                                onClick={(e) => this.openActionSheet(e)}
                                fill={'var(--text_secondary)'}/>
                        </div>

                    }
                </div>
            </div>
        )
    }
}

export default MeetBox;
