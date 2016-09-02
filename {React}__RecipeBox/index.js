var React = require('react');
var ReactDOM = require('react-dom');
var Collapse = require('pui-react-collapse').Collapse;
var ExpanderContent = require('pui-react-expander').ExpanderContent;
var DangerButton = require('pui-react-buttons').DangerButton;
var DefaultButton = require('pui-react-buttons').DefaultButton;


const AddRecipe = React.createClass({
    getInitialState() {
        return {expanded: false, name: '', ingredients: ''};
    },

    toggleContent() {
        this.setState({expanded: !this.state.expanded});
    },
    handleRecipeNameChange(e) {
        this.setState({name: e.target.value});
    },
    handleIngredientsChange(e) {
        this.setState({ingredients: e.target.value});
    },
    addRecipe(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var ingredients = this.state.ingredients.trim();
        if (!name || !ingredients) {
            return;
        }
        this.props.onCommentSubmit({name: name, ingredients: ingredients});
        this.setState({expanded: false, name: '', ingredients: ''});
    },

    render: function () {
        return (
            <main>
                <ExpanderContent
                    expanded={this.state.expanded}
                    onEntered={() => {
                        console.log('onEntered')
                    }}
                    onExited={() => {
                        console.log('onExited')
                    }}>
                    <p className='h1 bg-neutral-2 type-neutral-9'>
                        <form onSubmit={this.addRecipe}>
                            <div><input
                                id="RecipeInput"
                                value={this.state.name}
                                placeholder="Recipe Name"
                                onChange={this.handleRecipeNameChange}
                            /></div>
                            <div><input
                                id="IngredientsInput"
                                value={this.state.ingredients}
                                placeholder="Enter Ingredients, Separated by commas."
                                onChange={this.handleIngredientsChange}
                            /></div>
                            <div><input type="submit" value="Add"/></div>
                        </form>
                    </p>
                </ExpanderContent>
                <DefaultButton className='btn btn-highlight' onClick={this.toggleContent}>
                    Add Recipe
                </DefaultButton>
            </main>
        )
    }
});


var ProductRow = React.createClass({
    deleteRecipe(){
        this.props.deleteRecipe(this.props.line_num);
    },
    render: function () {
        var ingredients_list = [];
        var ingredients = this.props.recipe.ingredients.split(',');
        for (var i = 0; i < ingredients.length; i++) {
            ingredients_list.push(<p>{ingredients[i]}</p>)
        }
        return (
            <Collapse header={this.props.recipe.name} divider>
                {ingredients_list}
                <DefaultButton>Edit</DefaultButton>
                <DangerButton onClick={this.deleteRecipe}>Delete</DangerButton>
            </Collapse>
        );
    }
});

var RecipeTable = React.createClass({
    deleteRecipe(line_num){
        this.props.deleteRecipe(line_num);
    },
    render: function () {
        var rows = [];
        for(var i=0; i<this.props.recipeList.length; i++){
            rows.push(<ProductRow recipe={this.props.recipeList[i]} line_num={i} deleteRecipe={this.deleteRecipe}/>);
        }
        return (
            <div style={{backgroundColor: '#f5f5f5'}}>
                <div style={{padding: '20px 20px 20px 20px'}}>
                    {rows}
                </div>
            </div>
        );
    }
});

var RecipeBox = React.createClass({
    getInitialState() {
        return {
            recipeList: this.props.recipeList
        };
    },
    handleCommentSubmit(comment) {
        this.props.recipeList.push(comment);
        this.setState({recipeList: this.props.recipeList});
    },
    deleteRecipe(line_num){
        this.props.recipeList.splice(line_num, 1);
        this.setState({recipeList: this.props.recipeList});
    },

    render: function () {
        return (
            <div>
                <RecipeTable
                    recipeList={this.props.recipeList}
                    deleteRecipe = {this.deleteRecipe}
                />
                <AddRecipe recipeList={this.state.recipeList} onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});


var RECIPE = [
    {name: 'Pumpkin Pie', ingredients: 'Pumpkin Puree,Sweetened Condensed Milk,Eggs,Pumpkin Pie Spice,Pie Crust'},
    {name: 'Spaghetti', ingredients: 'Noodles,Tomato Sauce,(Optional) Meatballs'},
    {name: 'Onion Pie', ingredients: 'Onion,Pie Crust,Sounds Yummy right?'}
];

ReactDOM.render(
    <RecipeBox recipeList={RECIPE}/>,
    document.getElementById('root')
);