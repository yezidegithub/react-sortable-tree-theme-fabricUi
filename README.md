# React Sortable Tree Fabric GroupList Theme


## Features

- Use fabric ui [GroupList](https://developer.microsoft.com/en-us/fabric/#/controls/web/groupedlist) render node content ,so you can use the feature of it.

## Usage

```sh
npm install --save react-sortable-tree-theme-fabric
```

```jsx
import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-fabric';

export default class Tree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [
        { title: 'Trained Models' ,
          children:[
            { 
              title: 'Income Prediction [trained models]' , 
              children:[
                { title: 'Income Prediction [trained models-sub]' }
              ]
            }
          ]
        },
        { title: 'Data Format Conversions' ,
          children:[
            { title: 'Convert to ARFF'}
          ]
        },
      ],
    };
  }

  render() {
    return (
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={treeData => this.setState({ treeData })}
          theme={FileExplorerTheme}
        />
      </div>
    );
  }
}
```
