var React = require('react');
var ReactDOM = require('react-dom');

var CamperLeaderBoard = React.createClass({
    getInitialState: function () {
        return {
            campers: [],
            last30text: "Points in past 30 days",
            alltimetext: "All time points(click to sort)"
        };
    },
    componentDidMount: function () {
        this.serverRequest = $.get(this.props.source_30, function (result) {
            this.setState({
                campers: result
            });
        }.bind(this));
    },
    sort30 (){
        this.serverRequest = $.get(this.props.source_30, function (result) {
            this.setState({
                campers: result,
                last30text: "Points in past 30 days",
                alltimetext: "All time points(click to sort)"
            });
        }.bind(this));
    },
    sortAll (){
        this.serverRequest = $.get(this.props.source_all, function (result) {
            this.setState({
                campers: result,
                last30text: "Points in past 30 days(click to sort)",
                alltimetext: "All time points"
            });
        }.bind(this));
    },
    render: function () {
        var rows = [];
        this.state.campers.forEach(function (camper) {
            rows.push(<tr>
                        <td>
                            <div className={"row"}>
                                <div className={"col-sm-2"}><img src={camper['img']} height="40px" width="40px"/> </div>
                                <div className={"col-sm-10"}>{camper['username']}</div>
                            </div>
                        </td>
                        <td>{camper['recent']}</td>
                        <td>{camper['alltime']}</td>
                    </tr>);
        });
        return (
            <div>
                <table className={"table table-striped"}>
                    <thead>
                        <tr style={{"background-color": "#381F0B"}}>
                            <th> </th>
                            <th style={{"fontSize": "32px", "color": "white"}}>Leaderboard</th>
                            <th> </th>
                        </tr>
                        <tr>
                            <th style={{"fontSize": "22px"}}>Camper Name</th>
                            <th style={{"fontSize": "22px", "color": "green"}} onClick={this.sort30}>{this.state.last30text}</th>
                            <th style={{"fontSize": "22px", "color": "green"}}  onClick={this.sortAll}>{this.state.alltimetext}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

ReactDOM.render(
    <CamperLeaderBoard
        source_30="https://fcctop100.herokuapp.com/api/fccusers/top/recent"
        source_all="https://fcctop100.herokuapp.com/api/fccusers/top/alltime"
    />,
    document.getElementById('root')
);