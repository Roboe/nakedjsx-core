//
// Wrap Element.appendChild so that it can add an array of elements.
// This allows a JSX fragment to be passed to appendChild.
//
// Also add support for adding a string as a text node.
//

const originalAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild =
    function(child)
    {
        if (Array.isArray(child))
            for (const childArrayMember of child)
                this.appendChild(childArrayMember);
        else
        {
            const boundAppendChild = originalAppendChild.bind(this);

            if (typeof child === 'string')
                boundAppendChild(document.createTextNode(child));
            else
                boundAppendChild(child);
        } 
    };

export function __nakedjsx__createElement(tag, props, ...children)
{
    props = props || {};
    
    if (typeof tag === "function")
    {
        // Make child elements selectively placeable via {props.children}
        props.children = children;

        return tag(props, children);
    }

    //
    // We're dealing with regular HTML, not a JSX function
    //

    const element = document.createElement(tag);

    Object.entries(props).forEach(
        ([name, value]) =>
        {
            if (name.startsWith('on'))
            {
                const lowercaseName = name.toLowerCase();
                
                if (lowercaseName in window)
                    element.addEventListener(lowercaseName.substring(2), value);
            }
            else if (name === 'className')
                element.setAttribute('class', value);
            else
                element.setAttribute(name, value);
        });

    children.forEach((child) => element.appendChild(child));

    return element;
}

export function __nakedjsx__createFragment(props)
{
    return props.children;
}