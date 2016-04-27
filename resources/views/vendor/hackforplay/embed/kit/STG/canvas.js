var Canvas = function(surface)
{
    this.element = surface._element;
    this.context = surface.context;


    this.width = surface.width;
    this.height = surface.height;
}


Canvas.prototype.Clear = function()
{
    this.context.clearRect(0, 0, this.width, this.height);
}


Canvas.prototype.ArcPath = function(x, y)
{
    var context = this.context;

    return function(r)
    {
        return function(rad, brad)
        {

                context.beginPath();
                context.arc(x, y, r, brad || 0.0, rad);

        }
    }
}
