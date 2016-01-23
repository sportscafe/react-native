'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

var REQUEST_URL ='https://sportscafe.in/';

var sportscafe = React.createClass({
  render: function() {
    if(!this.state.dataSource){
      this.renderArticlesView();
    }
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderArticle}
        style={styles.listView}
      />
    );
  },
  renderArticlesView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading articles...
        </Text>
      </View>
    );
  },
  renderArticle: function(article) {
    return (
      <View style={styles.articleContainer}>
      <TouchableHighlight
        onPress={this.props.onSelect}
        onShowUnderlay={this.props.onHighlight}
        onHideUnderlay={this.props.onUnhighlight}>
        <View style={styles.row}>
          <Image
            source={{uri:'https://d22lvl9g4trg1l.cloudfront.net/img/es3-cscale-w1400/'+article.images.featured.path}}
           style={styles.cellImage}
           />
          <View style={styles.textContainer}>
            <Text>
              {article.title}
            </Text>
            <Text style={styles.classifications}>
              {article.classifications.sections.sport}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      </View>
    );
  },
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },
  componentDidMount: function(){
    this.getArticlesWithConditions();
  },
  getArticlesWithConditions: function() {
    fetch('http://11.0.0.20:4000/api/articles/getArticlesWithConditions', {
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "msg":{
          "conditions":{
            "published":true,
            "$and":[
              {
                "classifications.sections.misc":{"$ne":"international"}
              }
            ],
            "classifications.sections.articleType":"match report"
          },
          "projection":{
            "content":0
          },
          "options":{
            "sort":{"publishDate":-1},
            "skip":0,
            "limit":8
          }
        }
      })
    },)
      .then((response) => response.text())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(JSON.parse(responseData)),
          loaded: true,
          articles:JSON.parse(responseData),
        });
        console.log(this.state.articles);
      })
      .catch((error) => {
        console.warn(error);
      })
      .done();
  },
});

var styles = StyleSheet.create({
  articleContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width :100,
    height :81,
  },
  articleContentContainer: {
    flex: 1,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'column',
    padding: 5,
    borderWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderColor: '#004c4c',
    paddingBottom: 5,
  },
  cellImage: {
    flex: 2,
    width:250,
    height:150,
    borderColor: 'black',
    borderWidth: 2,
  },
  classifications:{
    fontSize:4,
  }
});

AppRegistry.registerComponent('sportscafe', () => sportscafe);
