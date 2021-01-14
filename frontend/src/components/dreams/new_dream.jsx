import React from 'react';

class NewDream extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.info === null 
            || Object.values(this.props.info).length === 0) {
            this.state = {
                selectedOption: 'dream',
                dreamText: '',
                searchValue: '',
                tags: [],
                showClose: false,
            }
        } else {
            this.state = {
                selectedOption: this.props.info.type,
                dreamText: this.props.info.text,
                searchValue: '',
                tags: this.props.info.tags,
                showClose: false,
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTags = this.handleTags.bind(this);
        this.addTag = this.addTag.bind(this);
        this.removeTag = this.removeTag.bind(this);
        this.hideShow = this.hideShow.bind(this);
        this.closeDreamCreation = this.closeDreamCreation.bind(this);
    }

    componentDidMount() {
        this.props.resetErrors();
    }

    handleChange(type) {
        return (e) => {
            this.props.clearErrors();
            this.setState({ [type]: e.currentTarget.value })
        }
    }

    handleSearchChange(e) {
        this.props.clearErrors();
        this.props.fetchSearchResults(e.target.value);
        this.setState({ searchValue: e.target.value, showClose: true })
    }

    hideShow() {
        this.props.clearSearch();
        this.setState({ showClose: false, searchValue: '' })
    }

    handleSubmit(e) {
        e.preventDefault();
        let newDream = {
            username: this.props.currentUser.username,
            userId: this.props.currentUser.id,
            type: this.state.selectedOption,
            text: this.state.dreamText,
            tags: this.state.tags
        }
        if (Object.values(this.props.info).length === 0) {
            this.props.createDream(newDream);
        } else {
            this.props.updateDream(this.props.info._id, newDream);
        }
        
        setTimeout(() => this.closeDreamCreation(), 500)
    }
        
    closeDreamCreation() {
        if (this.props.errors.length === 0) {
            this.props.closeModal()
            window.location.reload();
        }
    }

    handleTags(tag) {
        let newTags = this.state.tags
        if (Object.values(this.props.errors).length === 0) {
            newTags.push(tag)
        }
        this.setState({ tags: newTags, showClose: false, searchValue: '' })
        this.props.clearSearch();
    }

    addTag() {
        this.props.createTag({tag: this.state.searchValue});
        console.log('errors' + this.props.errors);
        setTimeout(() => this.handleTags(this.state.searchValue), 500)
        // if (Object.values(this.props.errors).length === 0) {
        //     this.handleTags(this.state.searchValue);
        // }
    }

    removeTag(tag) {
        return (e) => {
            let newTags = this.state.tags
            let idx = newTags.indexOf(tag)
            delete newTags[idx]
            let newestTags = newTags.filter(t => t.length > 0)
            console.log(newestTags)
            this.setState({ tags: newestTags })
            this.props.clearErrors();
        }
    }

    render() {
        let tags;

        if (this.state.tags){
            tags = 
                this.state.tags.map((tag, idx) => {
                    if (tag != null) {
                        return (
                            <div key={idx} 
                                className="new-dream-tags-item-container" 
                                onClick={this.removeTag(tag)}
                            >
                                <div 
                                    className="new-dream-tags-item-circle" >

                                </div>
                                <p 
                                    className="new-dream-tags-item" >{tag}
                                </p>
                            </div>
                        )
                    } else {
                        return null;
                    }
                })
            
        }

        let search;

        if (Object.values(this.props.searchResults).length > 0) {

            search = <div>
                        {Object.values(this.props.searchResults.tags)
                            .map((result, idx) => (
                                <div 
                                    className=
                                        "tag-search-results-outer-container" 
                                >
                                    <div 
                                        className=
                                            "tag-search-results-inner-container" 
                                        onClick={
                                            () => this.handleTags(result.name)} 
                                        key={idx} 
                                    >
                                        <i class="fas fa-tag search-icon">
                                        </i>
                                        {result.name}
                        </div>
                    </div>
                ))}
            </div>
        } else {
            search = null;
        }

        return (
            <div 
                className="new-dream-container" 
                onClick={e => e.stopPropagation()} 
            >
                <h1 
                    className="new-dream-header" >{this.props.info === null 
                    || Object.values(this.props.info).length === 0 
                    ? "New Dream" 
                    : "Edit Dream"
                    }
                </h1>
                <form 
                    className="new-dream-radio">
                    <label 
                        className="new-dream-radio-btn" >
                        <h1 
                            className={
                                this.state.selectedOption === 'dream' 
                                ? "new-dream-radio-btn-header-checked" 
                                : "new-dream-radio-btn-header"} 
                        >
                                    Dream
                        </h1>
                        <input
                            type="radio"
                            value="dream"
                            checked={this.state.selectedOption === "dream"}
                            onChange={this.handleChange('selectedOption')}
                        />
                    </label>
                    <label className="new-dream-radio-btn" >
                        <h1 
                            className={
                                this.state.selectedOption === 'goal' 
                                    ? "new-dream-radio-btn-header-checked" 
                                    : "new-dream-radio-btn-header"} 
                        >
                                        Goal
                        </h1>
                        <input
                            type="radio"
                            value="goal"
                            checked={this.state.selectedOption === "goal"}
                            onChange={this.handleChange('selectedOption')}
                        />
                    </label>
                </form>
                <div className="new-dream-tags-container" >
                    <h1 className="new-dream-tags-header" >Tags:</h1>
                    <div className="new-dream-tags" >
                        {tags}
                    </div>
                </div>
                <div 
                    className="create-dream-container" 
                    onClick={e => e.stopPropagation()} 
                >
                    <div className="create-dream-search-container" >
                        <i className="fas fa-search dream-search-icon"></i>
                        <form 
                            className="create-dream-search-form" 
                            onSubmit={()=>this.handleTags()}
                        >
                            <input type="text"
                                placeholder="Search tags or create a new one"
                                value={this.state.searchValue}
                                onChange={this.handleSearchChange}
                                className="create-dream-search-input" 
                            />
                        </form>
                        <i onClick={this.addTag} 
                            onSubmit={e => e.stopPropagation()} 
                            className={
                                this.state.showClose 
                                    ? "fas fa-check-circle search-check-btn" 
                                    : ''
                            }
                        >
                        </i>
                        <i 
                            onClick={this.hideShow} 
                            onSubmit={e => e.stopPropagation()} 
                            className={
                                this.state.showClose 
                                ? "fas fa-times-circle close-search-btn" 
                                : ''}
                        >
                        </i>
                    </div>
                    {search}
                </div>
                <div className="create-dream-container" >
                    <form className="create-dream-text-container" >
                        <textarea 
                            className="create-dream-textarea" 
                            placeholder="Share your dreams..."
                            value={this.state.dreamText}
                            onChange={this.handleChange('dreamText')}>
                        </textarea>
                    </form>
                    <div className="session-errors-container">
                        {Object.values(this.props.errors).map(err => {
                        return <p className="session-errors" >{err}</p>
                    })}
                    </div>
                </div>
                <div className="create-dream-btn" >
                    <input className="new-dream-btn" 
                        type="submit" 
                        value={
                            this.props.info === null 
                            || Object.values(this.props.info).length === 0 
                            ? "Create Dream" 
                            : "Edit Dream"
                        }
                        onClick={this.handleSubmit} 
                        />
                </div>
            </div>
        )
    }
}

export default NewDream;