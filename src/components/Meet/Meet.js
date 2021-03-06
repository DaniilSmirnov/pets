import React, {Component} from 'react';
import {
    ActionSheet,
    ActionSheetItem,
    Button,
    Div,
    Group,
    Header,
    IS_PLATFORM_IOS,
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Spinner,
    Text
} from '@vkontakte/vkui';
import MeetBox from '../MeetBox/MeetBox';
import bridge from '@vkontakte/vk-bridge';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import ComList from '../Communities/ComList';
//import {shortNumber} from '../js/helpers';
import '@vkontakte/vkui/dist/vkui.css';
import '../../panels/Home.css';

class Meet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meet: this.props.state.meet,
            disabled: false,
            snackbar: null,
            flood: false
        };
        this.api = this.props.api;
    }

    componentDidMount() {
        const {setParentState} = this.props;
        this.api.GetMeetComments(this.props.state.meet.id).then(comments => setParentState({comments}))
    }

    render() {
        const {id, onStoryChange, setParentState, activeStory} = this.props;
        const {meet, disabled} = this.state;
        //  var meetMembers = shortNumber(meet.members_amount)
        //  const stop_date = meet.finish.split('-').reverse().join('-')
        //  const backgroundImage = `url(${meet.photo})`;
        // var link = meet.ownerid > 0 ? `https://vk.com/id${meet.ownerid}` : `https://vk.com/club${-meet.ownerid}`

        const paticipate = e => {
            this.setState({disabled: true});
            this.api.AddMeetMember({
                meet: meet.id
            }).then(res => {
                if(!res.success) return;
                let meet2 = meet;
                meet2.ismember = true;
                meet2.members_amount++;
                this.setState({disabled: false});
                setParentState({
                    meet: meet2
                })
               // onStoryChange(activeStory, 'meets')
            });
        };
        const removeMeetMember = e => {
            this.setState({disabled: true});
            this.api.RemoveMeetMember({
                meet: meet.id
            }).then(res => {
                this.setState({disabled: false});
                if(!res.success) return;
                let meet2 = meet;
                meet2.ismember = false;
                meet2.members_amount--;
                setParentState({
                    meet: meet2
                })
            })
        };
        const menu = e => {
            setParentState({
                popout:
                    <ActionSheet onClose={() => setParentState({popout: null})}>
                        <ActionSheetItem onClick={share} autoclose>
                            Поделиться на стене
                        </ActionSheetItem>
                        <ActionSheetItem onClick={() => this.props.makeStory(meet.id)} autoclose>
                            Поделиться в истории
                        </ActionSheetItem>
                        <ActionSheetItem onClick={() => {
                            bridge.send("VKWebAppShare", {"link": `https://vk.com/app7217332#${meet.id}`});
                        }} autoclose>
                            Отправить сообщением
                        </ActionSheetItem>
                        {
                            IS_PLATFORM_IOS &&
                            <ActionSheetItem
                                autoclose
                                mode="destructive"
                            >
                                Отменить
                            </ActionSheetItem>
                        }
                    </ActionSheet>,
            });
        };
        const share = e => {
            bridge.send("VKWebAppShowWallPostBox", {"message": `${meet.name}\n\n${meet.description}\n\n Примите участие в петиции по ссылке: https://vk.com/app7217332#${meet.id}`});
        };
        return (
            <Panel id={id}>
                <PanelHeader left={
                    <PanelHeaderButton onClick={() => onStoryChange(activeStory, 'meets')}>
                        {IS_PLATFORM_IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                    </PanelHeaderButton>}>Петиция</PanelHeader>
                <Group header={<Header mode="secondary">Краткие сведения о петиции</Header>}>
                    <Div>
                        <MeetBox
                            onMeet
                            meet={meet}
                            setParentState={null}
                            style={{marginLeft: 12, marginRight: 12}}
                        />
                    </Div>
                </Group>
                <Group separator="show" header={<Header mode="secondary">Описание петиции</Header>}>
                    <Div>
                        <Text weight="regular">{meet.description}</Text>
                    </Div>
                </Group>
                {
                    (!meet.isexpired && meet.approved) &&
                    <div>
                        <Group header={<Header mode="secondary">Действия</Header>}>
                            <Div style={{display: 'flex'}}>
                                <Button size="l" disabled={disabled} stretched mode='outline' style={{marginRight: 12}}
                                        onClick={() => !this.props.state.meet.ismember ? paticipate() : removeMeetMember()}>{disabled ?
                                    <Spinner
                                        size='small'/> : !this.props.state.meet.ismember ? 'Участвовать' : 'Отказаться от участия'}</Button>
                                <Button size="l" stretched mode='outline' onClick={menu}>Поделиться</Button>
                            </Div>
                            {
                                this.props.state.meet.ismember &&
                                <Div style={{display: 'flex', justifyContent: 'center'}}>
                                    <Button
                                        size="l"
                                        mode='outline'
                                        onClick={() => {
                                            bridge.send("VKWebAppGetGeodata", {}).then(res => {
                                                if (res && res.available && res.lat) {
                                                    setParentState({
                                                        activePanel: 'map',
                                                        userGeo: [res.lat, res.long]
                                                    });
                                                    this.api.POSTGeoPosition({
                                                        lat: res.lat,
                                                        long: res.long
                                                    })
                                                } else {
                                                    this.props.openErrorSnackbar('Ошибка определения геопозиции.')
                                                }
                                            })
                                        }}
                                    >
                                        Найти единомышленников
                                    </Button>
                                </Div>
                            }
                        </Group>
                        <Group header={<Header mode="secondary">Комментарии</Header>}>
                            {meet.approved && <ComList isExpired={meet.isexpired} {...this.props} />}
                        </Group>
                    </div>
                }
                {this.props.state.snackbar}
            </Panel>
        );
    }
}

export default Meet;
