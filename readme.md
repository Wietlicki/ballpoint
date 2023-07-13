# Ballpoint

Ballpoint is a rich text editor typescript framework and component library for React.

Ballpoint provides a ready-for-use editor component complete with a toolbar, but it can also serve as an alternative to the now archived draft.js framework.

The objective is for Ballpoint to provide a **light-weight**, **user-friendly** and **customisable** framework focused on text editing.

**Please be warned,** the project is currently in it's early stages and while the current version is working it may lack certain functionality. 

## Overview
### Main Components

Ballpoint has 2 main key components:

The `Core` component renders a `contenteditable` div and responds to keyboard input as well as clipboard events. This component can be used to build a custom editor.

The `Editor` component is the default implementation of the `Core` component along with a `Toolbar` component. The `Editor` offers a degree of customisation and is designed to be embedded into a project with minimal effort.

### Key Classes

All content is stored as `BallpointNode`s that form a node-tree similar to the DOM tree. The class itself provides methods for converting it's content into html, plain-text and jsx for rendering.

The `CoreState` defines the state of the `Core` component and can be initialised from html or plain-text. The 'root' `BallpointNode` can be accessed via `CoreState.contentNode`.

## Usage
### Uncontrolled Editor
The simplest implementation of the `Editor` component would be to render it as an uncontrolled component with an init value and a `onChange` handler.
In this scenario, if we worked with html content then we'd simply pass a string containing the html to the component as a `initHtml` prop and then we'd update the reference to the uncontrolled editor state in the `onChange` handler.

Once done with the editing and ready to unmount the component we'd simply use the `CoreState.contentNode.toHtmlText()` method to convert the content back into html.

```jsx
export class EditorParent extends Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    handleChange = (state) => {
        this.setState({coreState: state});
    }
    render() {
        return <Editor initHtml={this.props.initHtmlString} onChange={this.handleChange}/>
    }
}
```

### Controlled Editor
The `Editor` component can easily be controlled via the `controlledCoreState` prop and an `onChange` handler. The only complication here is that we need to create a new `CoreState` when the component is being mounted. If there is initial content, the `CoreState` constructor can take a html string or a plain-text string, which makes this process simple.

The content held within the `controlledCoreState` could then be converted into html text with `CoreState.contentNode.toHtmlText()`.

```jsx
export class EditorParent extends Component {
    constructor(props){
        super(props);
        this.state = {coreControlledState: new CoreState(props.initHtmlString)};
    }
    handleChange = (state: ICoreState) => {
        this.setState({coreControlledState: state});
    }
    render() {
        return <Editor controlledCoreState = {this.state.coreControlledState} onChange={this.handleChange}/>
    }
}
```