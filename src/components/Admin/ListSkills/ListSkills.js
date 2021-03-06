import React from 'react';
import Table from 'antd/lib/table';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import Cookies from 'universal-cookie';
import './ListSkills.css';
import * as $ from 'jquery';

const cookies = new Cookies();

class ListSkills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skillsData: [],
      loading: true,
      openSnackbar: false,
      msgSnackbar: '',
      isAction: false,
      showDialog: false,
      skillName: '',
      skillTag: '',
      skillModel: '',
      skillGroup: '',
      skillLanguage: '',
      skillReviewStatus: false,
      changeReviewStatusSuccessDialog: false,
      changeReviewStatusFailureDialog: false,
    };
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'skillName',
        width: '20%',
      },
      {
        title: 'Group',
        dataIndex: 'group',
        filters: [
          {
            text: 'Business and Finance',
            value: 'Business and Finance',
          },
          {
            text: 'Communication',
            value: 'Communication',
          },
          {
            text: 'Connected Car',
            value: 'Connected Car',
          },
          {
            text: 'Food and Drink',
            value: 'Food and Drink',
          },
          {
            text: 'Games, Trivia and Accessories',
            value: 'Games, Trivia and Accessories',
          },
          {
            text: 'Health and Fitness',
            value: 'Health and Fitness',
          },
          {
            text: 'Knowledge',
            value: 'Knowledge',
          },
          {
            text: 'Lifestyle',
            value: 'Lifestyle',
          },
          {
            text: 'Movies and TV',
            value: 'Movies and TV',
          },
          {
            text: 'Music and Audio',
            value: 'Music and Audio',
          },
          {
            text: 'News',
            value: 'News',
          },
          {
            text: 'Novelty and Humour',
            value: 'Novelty and Humour',
          },
          {
            text: 'Problem Solving',
            value: 'Problem Solving',
          },
          {
            text: 'Productivity',
            value: 'Productivity',
          },
          {
            text: 'Shopping',
            value: 'Shopping',
          },
          {
            text: 'Social',
            value: 'Social',
          },
          {
            text: 'Sports',
            value: 'Sports',
          },
          {
            text: 'Travel and Trasportation',
            value: 'Travel and Trasportation',
          },
          {
            text: 'Utilities',
            value: 'Utilities',
          },
          {
            text: 'Weather',
            value: 'Weather',
          },
        ],
        onFilter: (value, record) => record.group.indexOf(value) === 0,
        sorter: (a, b) => a.group.length - b.group.length,
        width: '15%',
      },
      {
        title: 'Language',
        dataIndex: 'language',
        width: '10%',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        filters: [
          {
            text: 'Public',
            value: 'public',
          },
          {
            text: 'Private',
            value: 'private',
          },
        ],
        onFilter: (value, record) => record.type.indexOf(value) === 0,
        sorter: (a, b) => a.type.length - b.type.length,
        width: '10%',
      },
      {
        title: 'Author',
        dataIndex: 'author',
        width: '20%',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        filters: [
          {
            text: 'Reviewed',
            value: 'Reviewed',
          },
          {
            text: 'Not Reviewed',
            value: 'Not Reviewed',
          },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        sorter: (a, b) => a.status.length - b.status.length,
        width: '15%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        width: '10%',
        // eslint-disable-next-line
        render: (text, record) => {
          return (
            <span>
              <div
                style={{ cursor: 'pointer', color: '#49A9EE' }}
                onClick={() =>
                  this.handleOpen(
                    record.skillName,
                    record.model,
                    record.group,
                    record.language,
                    record.reviewStatus,
                    record.skillTag,
                  )
                }
              >
                Edit
              </div>
            </span>
          );
        },
      },
    ];
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
  }

  componentDidMount() {
    this.loadSkills();
  }

  changeStatus = () => {
    let url;
    url =
      `https://api.susi.ai/cms/changeSkillStatus.json?model=${
        this.state.skillModel
      }&group=${this.state.skillGroup}&language=${
        this.state.skillLanguage
      }&skill=${this.state.skillTag}&reviewed=${
        this.state.skillReviewStatus
      }&access_token=` + cookies.get('loggedIn');
    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonp: 'callback',
      crossDomain: true,
      success: function(data) {
        this.setState({ changeReviewStatusSuccessDialog: true });
      }.bind(this),
      error: function(err) {
        console.log(err);
        this.setState({ changeReviewStatusFailureDialog: true });
      }.bind(this),
    });
  };

  loadSkills = () => {
    let url;
    url =
      'https:/api.susi.ai/cms/getSkillList.json?' +
      'applyFilter=true&filter_name=ascending&filter_type=lexicographical';
    let self = this;
    $.ajax({
      url: url,
      jsonpCallback: 'pxcd',
      dataType: 'jsonp',
      jsonp: 'callback',
      crossDomain: true,
      success: function(data) {
        let skills = [];
        for (let i of data.filteredData) {
          let skill = {
            skillName: i.skill_name,
            model: i.model,
            group: i.group,
            language: i.language,
            skillTag: i.skill_tag,
            reviewStatus: i.reviewed,
            type: 'public',
            author: i.author,
            status: i.reviewed ? 'Approved' : 'Not Reviewed',
          };
          skills.push(skill);
        }
        self.setState({
          skillsData: skills,
          loading: false,
        });
      },
      error: function(err) {
        self.setState({
          loading: false,
          openSnackbar: true,
          msgSnackbar: "Error. Couldn't fetch skills.",
        });
      },
    });
  };

  handleChange = () => {
    this.changeStatus();
    this.setState({
      showDialog: false,
    });
  };

  handleOpen = (name, model, group, language, reviewStatus, skillTag) => {
    this.setState({
      skillModel: model,
      skillGroup: group,
      skillLanguage: language,
      skillName: name,
      skillTag: skillTag,
      skillReviewStatus: reviewStatus,
      showDialog: true,
    });
  };

  handleClose = () => {
    this.setState({
      showDialog: false,
    });
  };

  handleStatusChange = (event, index, value) => {
    this.setState({
      skillReviewStatus: value,
    });
  };

  handleFinish = () => {
    window.location.reload();
  };

  render() {
    const actions = [
      <FlatButton
        key={1}
        label="Change"
        primary={true}
        onTouchTap={this.handleChange}
      />,
      <FlatButton
        key={2}
        label="Cancel"
        primary={false}
        onTouchTap={this.handleClose}
      />,
    ];

    const blueThemeColor = { color: 'rgb(66, 133, 244)' };
    const themeForegroundColor = '#272727';
    const themeBackgroundColor = '#fff';

    return (
      <div>
        {this.state.loading ? (
          <div className="center">
            <CircularProgress size={62} color="#4285f5" />
            <h4>Loading</h4>
          </div>
        ) : (
          <div className="table">
            <Dialog
              title="Skill Settings"
              actions={actions}
              model={true}
              open={this.state.showDialog}
            >
              <div>
                Change the review status of skill {this.state.skillName}
              </div>
              <div>
                <DropDownMenu
                  selectedMenuItemStyle={blueThemeColor}
                  onChange={this.handleStatusChange}
                  value={this.state.skillReviewStatus}
                  labelStyle={{ color: themeForegroundColor }}
                  menuStyle={{ backgroundColor: themeBackgroundColor }}
                  menuItemStyle={{ color: themeForegroundColor }}
                  style={{
                    width: '250px',
                    marginLeft: '-20px',
                  }}
                  autoWidth={false}
                >
                  <MenuItem
                    primaryText="Approved"
                    value={true}
                    className="setting-item"
                  />
                  <MenuItem
                    primaryText="Not Approved"
                    value={false}
                    className="setting-item"
                  />
                </DropDownMenu>
              </div>
            </Dialog>
            <Dialog
              title="Success"
              actions={
                <FlatButton
                  key={1}
                  label="Ok"
                  primary={true}
                  onTouchTap={this.handleFinish}
                />
              }
              modal={true}
              open={this.state.changeReviewStatusSuccessDialog}
            >
              <div>
                Review status of
                <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                  {this.state.skillName}
                </span>
                is changed to
                <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                  {this.state.skillReviewStatus ? 'Approved' : 'Not Approved'}
                </span>
                successfully!
              </div>
            </Dialog>
            <Dialog
              title="Failed!"
              actions={
                <FlatButton
                  key={1}
                  label="Ok"
                  primary={true}
                  onTouchTap={this.handleFinish}
                />
              }
              modal={true}
              open={this.state.changeReviewStatusFailureDialog}
            >
              <div>
                Error! Review status of
                <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                  {this.state.skillName}
                </span>
                could not be changed to
                <span style={{ fontWeight: 'bold', margin: '0 5px' }}>
                  {this.state.skillReviewStatus ? 'Approved' : 'Not Approved'}
                </span>!
              </div>
            </Dialog>
            <LocaleProvider locale={enUS}>
              <Table
                columns={this.columns}
                rowKey={record => record.registered}
                dataSource={this.state.skillsData}
                loading={this.state.loading}
              />
            </LocaleProvider>
          </div>
        )}
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.msgSnackbar}
          autoHideDuration={2000}
          onRequestClose={() => {
            this.setState({ openSnackbar: false });
          }}
        />
      </div>
    );
  }
}

export default ListSkills;
