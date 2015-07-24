"use babel"

var _ = require('lodash')
var React = require('react')
var ReactPropTypes = React.PropTypes
var cx = require('classnames')
var moment = require('moment')
require("moment-duration-format")

var PlayerStore = require('../../stores/PlayerStore')
var PlayerActions = require('../../actions/PlayerActions')

var ProgressBar = require('./ProgressBar.jsx')

function getPlayerState(){
  return PlayerStore.getPlaybackInfo()
}

module.exports = React.createClass({
  getInitialState: function(){
    return _.extend({
      showRemaining: false
    }, getPlayerState())
  },
  formatTime: function(time){
    return moment.duration(time, "seconds").format("mm:ss", { trim: false })
  },
  updateCover: function(cover){
    this.setState({ cover: cover })
  },
  prev: function(){
    PlayerActions.prevTrack()
  },
  next: function(){
    PlayerActions.nextTrack()
  },
  play: function(event){
    this.state.playing ? PlayerActions.pause() : PlayerActions.play()
  },
  componentDidMount: function(){
    PlayerStore.addChangeListener(this._onPlayerChange)
  },
  componentWillUnmount: function(){
    PlayerStore.removeChangeListener(this._onPlayerChange)
  },
  render: function() {
    var wrapperClasses = cx({
      'playback-track-info-wrapper' : true,
      'show-remaining'              : this.state.showRemaining,
      'hide-info'                   : this.state.hideInfo,
      'show-waveform'               : !!this.state.waveform
    })
    var logoClasses = cx({
      'playback-logo' : true,
      'hide-logo'     : !this.state.hideInfo
    })
    return (
      <div className="playback-bar">
        <div className={logoClasses}>Playa.</div>
        <div className="playback-buttons">
          <button onClick={this.prev}><i className="fa fa-fw fa-backward"></i></button>
          <button onClick={this.play}>{this.state.playing ? <i className="fa fa-fw fa-pause"></i> : <i className="fa fa-fw fa-play"></i>}</button>
          <button onClick={this.next}><i className="fa fa-fw fa-forward"></i></button>
        </div>
        <div className={wrapperClasses}>
          {this.renderCover()}
          <ProgressBar
            seekTo={this.seekTo}
            {...this.state}
            />          
          <span className="playback-time-indicator time-progress" onClick={this.handleTimeIndicatorClick}>
            {this.formatTime(this.state.currentTime)}
          </span>
          <div className="playback-track-info">
            <span className="playback-track-info-title">{ this.state.metadata.title }</span>
            <span className="playback-track-info-artist">{ this.state.metadata.artist } - { this.state.metadata.album }</span>
          </div>
          <span className="playback-time-indicator time-remaining" onClick={this.handleTimeIndicatorClick}>
            -{this.formatTime(this.state.remainingTime)}
          </span>
        </div>
      </div>
    )
  },
  renderCover: function(){
    if(this.state.cover){
      return (
        <div className="playback-track-cover"><img src={encodeURI(this.state.cover)}/></div>
      )
    }else{
      return null
    }
  },
  handleTimeIndicatorClick: function(event){
    this.setState({
      showRemaining: !this.state.showRemaining
    })
  },
  seekTo: function(position){
    PlayerActions.seek(position)
  },
  _onPlayerChange: function(){
    this.setState(getPlayerState())
    this.state.album && playa.coverLoader.load(this.state.album)
      .then(this.updateCover)
      .catch((err)=>{
        this.updateCover(false)
      })
  }
})
