# Ballpoint

Ballpoint is a rich text editor typescript framework and component library for React.

Ballpoint provides a ready-for-use editor component complete with a toolbar, but it can also serve as an alternative to the now archived draft.js framework.

The objective is for Ballpoint to provide a **light-weight**, **user-friendly** and **customisable** framework focused on text editing.

**Please be warned,** the project is currently in it's early stages and while the current version is working it may lack certain functionality. 

## Installation
Installation using npm:
```
npm install ballpoint
```

## Overview
### Main Components

Ballpoint has 2 main key components:

The `Core` component renders a `contenteditable` div and responds to keyboard input as well as clipboard events. This component can be used to build a custom editor.

The `Editor` component is the default implementation of the `Core` component along with a `Toolbar` component. The `Editor` offers a degree of customisation and is designed to be embedded into a project with minimal effort.

### Key Classes
#### BallpointNode
All content is stored as `BallpointNode`s that form a node-tree similar to the DOM tree. The class itself provides methods for converting it's content into html, plain-text and jsx for rendering.

#### CoreState
The `CoreState` defines the state of the `Core` component and can be initialised from html or plain-text. The 'root' `BallpointNode` can be accessed via `CoreState.contentNode`.

## Basic Usage
### Uncontrolled Editor
The simplest implementation of the `Editor` component would be to render it as an uncontrolled component with an init value and a `onChange` handler.
In this scenario, if we worked with html content then we'd simply pass a string containing the html to the component as a `initHtml` prop and then we'd update the reference to the uncontrolled editor state in the `onChange` handler.

Once done with the editing and ready to unmount the component we'd simply use the `CoreState.contentNode.toHtmlText()` method to convert the content back into html.

```jsx
import { Editor } from "ballpoint";
import { Component } from 'react';

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
import { Editor, CoreState } from "ballpoint";
import { Component } from 'react';

export class EditorParent extends Component {
    constructor(props){
        super(props);
        this.state = {coreControlledState: new CoreState(props.initHtmlString)};
    }
    handleChange = (state) => {
        this.setState({coreControlledState: state});
    }
    render() {
        return <Editor controlledCoreState = {this.state.coreControlledState} onChange={this.handleChange}/>
    }
}
```

## Basic Customisation
### Theme
The `Editor` component accepts a `theme` prop, which accepts three values i.e. `"dark" | "light" | "default"` and changes the overall colour scheme of the component.
For a clean interface use the `"light"` theme and if the background is dark the `"dark`" theme will work best.

```jsx
render() {
    return <Editor theme="light"/>
}
```
### Selecting Functionality
The `Editor` component accepts two config type props. i.e. `editorActionsConfig` and `editorClipboardActionsConfig`.
These are defined as:

```ts
export type EditorActionsConfig = {
    allowBold?: boolean;
    allowItalic?: boolean;
    allowUnderline?: boolean;
    allowStrikeOut?: boolean;
    allowFontSizeSelect?: boolean;
    allowFontColorSelect?: boolean;
    allowTextAlign?: boolean;
    allowHeader?: boolean;
    allowBulletList?: boolean;
    allowNumberedList?: boolean;
    allowUndo?: boolean;
    allowRedo?: boolean;
}
export type EditorClipboardActionsConfig = {
    allowCopy?: boolean;
    allowPaste?: boolean;
    allowCut?: boolean;
}
```

By default all functionality is 'allowed', but once a config object is passed as a prop only the functinality that is explicitly set as `true` will be 'allowed'.
The toolbar functionality and keyboard short-cuts will be aligned when configuring the `Editor` in this way.

In the example below **all** clipboard actions will be allowed because the `editorClipboardActionsConfig` prop is undefined, but for the `editorActionsConfig` prop the flags not listed in the specified object are assumed as false and hence the corresponding functionality will be disabled.

```jsx
render() {
    const editorActionsConfig = {
        allowBold: true,
        allowItalic: true,
        allowStrikeOut: true,
        allowHeader: true,
        allowBulletList: true,
        allowUndo: true
    }
    return <Editor editorActionsConfig = {editorActionsConfig}/>
}
```

## More Customisation
If the requirement is to build a custom editor with a bespoke toolbar then a more involved approach is needed that integrates the `Core` component.

### Configuring the Core Component
Much like with the editor we need to configure functionality for the `Core` component except that it only accepts keyboard input and so the two config object types are defined as:

```ts
export type CoreKeyActionsConfig = {
    allowBold?: boolean;
    allowItalic?: boolean;
    allowUnderline?: boolean;
    allowUndo?: boolean;
    allowRedo?: boolean;
}
export type CoreClipboardActionsConfig = {
    allowCopy?: boolean;
    allowCut?: boolean;
    allowPaste?: boolean;
}
```
The `CoreKeyActionsConfig` effectively enables/ disables keyboard short-cuts, while the `CoreClipboardActionsConfig` is self-explanatory.

### Using Core Actions
Because we will need to create a custom toolbar or some other component that will need to affect the content stored within the `Core`, 'action' methods will need to be triggered.

All action methods will require a reference to the rendered `Core` component hence we will need to create a react ref using `React.createRef()`.

For example to make selected text italic we would run the `actionApplyFormatting` method in the following way:

```js
actionApplyFormatting(coreRef.current, "i")
```

### Custom Editor Example
Below shows a very basic and essentially pointless implementation of a custom editor, but it illustrates how the `Core` component can be interacted with, and with some effort could be built out to something useful.

Note, that we are passing the `this.coreRef.current` reference to the action methods, which are then triggered on button clicks.

```jsx
import React, {Component} from 'react';
import { Core, actionApplyFormatting, actionApplyStyle } from "ballpoint";

export class CustomEditor extends Component {
    constructor(props){
        super(props);
        this.coreRef = React.createRef();
    }
    handleBoldClick = () => { actionApplyFormatting(this.coreRef.current, "b") };
    handleBigFontClick = () => { actionApplyStyle(this.coreRef.current, "fontSize", "28px") }
    render() {
        return <div>
            <button onClick={this.handleBoldClick}>Make Text Bold</button>
            <button onClick={this.handleBigFontClick}>Make Text Big</button>
            <Core 
                ref={this.coreRef}
                keyActionsConfig={{allowBold: true, allowRedo: true, allowUndo: true}}/>
        </div>
    }
}
```