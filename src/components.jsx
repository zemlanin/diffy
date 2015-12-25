import _ from 'lodash';
import React from 'react';
import classSet from 'classnames';
import {EVENTS} from './handlers';
import {getDiff} from './utils';

const STYLES = {PRE: "h-color-red", POST: "h-color-green"};

function fileComponent(file) {
    return (
        <li key={file.name}
            style={{width: "100%"}}>
            <a onClick={this.send(EVENTS.onFileClick, {name: file.name})}>
                {file.name}
                {file.category
                    ? ` (${file.category.name} / ${file.category.id})`
                    : ''
                }
                {file.data.error
                    ? <b> ! {file.data.error} !</b>
                    : ''
                }
            </a>
            <span style={{margin: "0 5px"}}/>
            <a onClick={this.send(EVENTS.onFileRemoveClick, {name: file.name})}>
                [x]
            </a>
        </li>
    );
}

function displayCriteria(data, diff, style, path='') {
    const hoveredPath = this.props.state.hoveredPath;

    if (!_.isObject(data)) {
        return (
            <span style={{width: "100%"}}
                className={classSet({
                    "h-bold": diff && diff.all,
                    [style]: diff && diff.all,
                })}
            >
                {JSON.stringify(data)}
            </span>
        );
    }

    return (
        <div style={{display: 'inline'}}>
            {'{'}
            <div style={{marginLeft: 10}}>
                {_(data)
                    .pairs()
                    .sortBy(_.first)
                    .map(([k, v]) => {
                        const innerDiff = _.get(diff, ['values', k]);
                        const fullPath = `${path}.${k}`;

                        return (
                            <div key={k}
                                className={classSet({
                                    "h-bold": innerDiff && innerDiff.all,
                                    [style]: innerDiff && innerDiff.all,
                                    "h-bg-light-grey": hoveredPath && fullPath == hoveredPath,
                                })}
                                onMouseEnter={this.send(EVENTS.onEnterPath, {path: fullPath})}
                                onMouseLeave={this.send(EVENTS.onEnterPath, {path})}
                            >
                                <span className={classSet({
                                    "h-bold": innerDiff && innerDiff.values,
                                })}>{k}: </span>
                                {displayCriteria.call(
                                    this, v, innerDiff, style, fullPath
                                )}
                            </div>
                        );
                    })
                    .value()}
            </div>
            {'}'}
        </div>
    );
}

function activeFileComponent(file) {
    const diffExisting = (
        file.data.error ? null : getDiff(file.existing, file.data)
    );

    const diffData = (
        file.data.error ? null : getDiff(file.data, file.existing)
    );

    return (
        <div style={{width: "70%"}}>
            <h3>{file.name}</h3>
            <div style={{display: "flex"}}>
                <div style={{width: "50%"}}>
                    {displayCriteria.call(
                        this, file.existing, diffExisting, STYLES.PRE, ''
                    )}
                </div>
                <div style={{width: "50%"}}>
                    {displayCriteria.call(
                        this, file.data, diffData, STYLES.POST, ''
                    )}
                </div>
            </div>
        </div>
    );
}

export class AppComponent extends React.Component {
    send(action, data) {
        return (event) => this.props.eventStream.send(action, {data, event});
    }
    render() {
        const props = this.props.state; // hack for tanok + live reload
        const {files, draggedOver} = props;

        const activeFile = _.find(files, {name: props.activeFile});

        return (
            <div
                style={{
                    minHeight: 300,
                    outline: draggedOver ? "5px dashed gray" : null,
                    backgroundColor: draggedOver ? 'lightgray' : null,
                    display: "flex",
                }}
                onDrop={this.send(EVENTS.onDrop)}
                onDragOver={this.send(EVENTS.onDragOver)}
                onDragLeave={this.send(EVENTS.onDragLeave)}
            >
                {files && files.length
                    ? (<div style={{width: "25%"}}>
                            <ul>
                                {files
                                    ? files.map(fileComponent, this)
                                    : null}
                            </ul>
                        </div>)
                    : (<div style={{textAlign: 'center', paddingTop: 100, width: "100%"}}>
                            <h2>drag brainiac file over here</h2>
                        </div>)}
                {activeFile
                    ? activeFileComponent.call(this, activeFile)
                    : null}
            </div>
        );
    }
}
