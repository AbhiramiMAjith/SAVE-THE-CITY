class Ground
{
    constructor (x, y, w, h)
    {
        this.w = w
        this.h = h        
        this.body = Bodies.rectangle (x, y, w, h,
        {
            isStatic : true
        })
        World.add (world, this.body)
    }
}