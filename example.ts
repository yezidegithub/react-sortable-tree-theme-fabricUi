const {
  GroupedList,
  IGroup,
  IColumn,
  DetailsRow,
  FocusZone,
  Selection,
  SelectionMode,
  SelectionZone,
  Toggle,
  IGroup,
  Fabric
} = window.Fabric;

const groupCount = 1;
const groupDepth = 2;

interface IGroupedListExampleState {
  isCompactMode?: boolean;
}

class GroupedListBasicExample extends React.Component<{}, IGroupedListExampleState> {
  private _items: IExampleItem[];
  private _columns: IColumn[];
  private _groups: IGroup[];
  private _selection: Selection;

  constructor(props: {}) {
    super(props);

    this._items = createListItems(Math.pow(groupCount, groupDepth + 1));
    console.log(this._items)
    this._columns = Object.keys(this._items[0])
      .slice(0, 3)
      .map(
        (key: string): IColumn => ({
          key: key,
          name: key,
          fieldName: key,
          minWidth: 300
        })
      );
    this._groups = createGroups(groupCount, groupDepth, 0, groupCount);
    console.log(this._groups);
    this._selection = new Selection();
    this._selection.setItems(this._items);

    this.state = {
      isCompactMode: false
    };
  }

  public render(): JSX.Element {
    const { isCompactMode } = this.state;

    return (
      <div>
        <Toggle
          label="Enable compact mode"
          checked={isCompactMode}
          onChange={this._onChangeCompactMode}
          onText="Compact"
          offText="Normal"
          styles={{ root: { marginBottom: '20px' } }}
        />
        <FocusZone>
          <SelectionZone selection={this._selection} selectionMode={SelectionMode.multiple}>
            <GroupedList
              items={this._items}
              onRenderCell={this._onRenderCell}
              selection={this._selection}
              selectionMode={SelectionMode.multiple}
              groups={this._groups}
              compact={isCompactMode}
            />
          </SelectionZone>
        </FocusZone>
      </div>
    );
  }

  private _onRenderCell = (
    nestingDepth: number,
    item: IExampleItem,
    itemIndex: number
  ): JSX.Element => {
    return (
      <DetailsRow
        columns={this._columns}
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex}
        selection={this._selection}
        selectionMode={SelectionMode.multiple}
        compact={this.state.isCompactMode}
      />
    );
  };

  private _onChangeCompactMode = (ev: React.MouseEvent<HTMLElement>, checked: boolean): void => {
    this.setState({ isCompactMode: checked });
  };
}

const LOREM_IPSUM = (
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
  'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
  'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
  'eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ' +
  'mollit anim id est laborum'
).split(' ');

const DATA = {
  color: ['red', 'blue', 'green', 'yellow'],
  shape: ['circle', 'square', 'triangle'],
  location: ['Seattle', 'New York', 'Chicago', 'Los Angeles', 'Portland']
};

interface IExampleItem {
  thumbnail: string;
  key: string;
  name: string;
  description: string;
  color: string;
  shape: string;
  location: string;
  width: number;
  height: number;
}

function createListItems(count: number, startIndex: number = 0): IExampleItem[] {
  return Array.apply(null, Array(count)).map((item: number, index: number) => {
    const size = 150 + Math.round(Math.random() * 100);

    return {
      thumbnail: `//placehold.it/${size}x${size}`,
      key: 'item-' + (index + startIndex) + ' ' + lorem(4),
      name: lorem(5),
      description: lorem(10 + Math.round(Math.random() * 50)),
      color: _randWord(DATA.color),
      shape: _randWord(DATA.shape),
      location: _randWord(DATA.location),
      width: size,
      height: size
    };
  });
}

function createGroups(
  groupCount: number,
  groupDepth: number,
  startIndex: number,
  itemsPerGroup: number,
  level: number = 0,
  key: string = '',
  isCollapsed?: boolean
): IGroup[] {
  if (key !== '') {
    key = key + '-';
  }
  const count = Math.pow(itemsPerGroup, groupDepth);
  return Array.apply(null, Array(groupCount)).map((value: number, index: number) => {
    return {
      count: count,
      key: 'group' + key + index,
      name: 'group ' + key + index,
      startIndex: index * count + startIndex,
      level: level,
      isCollapsed: isCollapsed,
      children:
        groupDepth > 1
          ? createGroups(
              groupCount,
              groupDepth - 1,
              index * count + startIndex,
              itemsPerGroup,
              level + 1,
              key + index
            )
          : []
    };
  });
}

function lorem(wordCount: number): string {
  return Array.apply(null, Array(wordCount))
    .map((item: number, idx: number) => {
      return LOREM_IPSUM[idx % LOREM_IPSUM.length];
    })
    .join(' ');
}

function isGroupable(key: string): boolean {
  return key === 'color' || key === 'shape' || key === 'location';
}

function _randWord(array: string[]): string {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

ReactDOM.render(
  <Fabric>
    <GroupedListBasicExample />
  </Fabric>,
  document.getElementById('content')
);
