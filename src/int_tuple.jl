# the recursive type definition is tricky to get right, we put Tuple here to represent it.
const IntTuple = Tuple{Vararg{Union{Int, IntSequence, Tuple}}}

Base.@propagate_inbounds function Base.getindex(@nospecialize(x::IntTuple), I1::Int, I2::Int, Is::Int...)
    return getindex(getindex(x, I1), I2, Is...)
end

@inline rank(@nospecialize x::IntTuple) = nfields(x)
@inline rank(@nospecialize x::Int) = 1
@inline rank(@nospecialize(x::IntTuple), I::Int...) = rank(getindex(x, I...))

# shape

@inline depth(@nospecialize x::Int) = 0
function depth(@nospecialize x::IntTuple)
    return max(map(depth, x)...) + 1
end


Base.prod(@nospecialize x::IntTuple) = reduce(*, flatten(x))

prod_each(@nospecialize x::IntSequence) = prod(x)
prod_each(@nospecialize x::IntTuple) = map(prod_each2, x)

Base.prod(@nospecialize(x::IntTuple), b::Int, e::Int) = prod(getindex(x, make_int_range(b, e)))

Base.size(@nospecialize x::IntTuple) = prod(x)
Base.size(@nospecialize(x::IntTuple), I::Int, Is::Int) = size(getindex(x, I, Is...))

Base.sum(@nospecialize x::IntTuple) = reduce(+, flatten(x))

inner_product(x::IntSequence, y::IntSequence) = reduce(+, map(*, x, y))
inner_product(@nospecialize(x::IntTuple), @nospecialize(y::IntTuple)) = reduce(+, map(inner_product, x, y))

Base.cld(x::IntSequence, y::IntSequence) = map(cld, x, y)
function Base.cld(x::IntTuple, y::IntTuple)
    @assert rank(x) >= rank(y)
    y = append(y, 1, rank(x))
    return map(cld, x, y)
end

#shape_div

@inline function elem_scale(x::Int, y)
    return x * prod(y)
end

function elem_scale(@nospecialize(x::IntTuple), @nospecialize(y::IntTuple))
    @assert rank(x) == rank(y)
    return map(elem_scale, x, y)
end

function iscongruent(@nospecialize(x::IntTuple), @nospecialize(y::IntTuple))
    return repeat_like(x, 0) === repeat_like(y, 0)
end

# Any coordinate into A can also be used as a coordinate into B
#@inline iscompatiable(@nospecialize(A::Int), @nospecialize(B::IntTuple)) = static(A == size(B))
#@inline iscompatiable(@nospecialize(A::IntTuple), @nospecialize(B::Int)) =false
#function iscompatiable(@nospecialize(A::IntTuple), @nospecialize(B::IntTuple))
#    rank(A) === rank(B) || return  false
#    return Static.reduce_tup(&, map(iscompatiable, A, B))
#end

# Replace the elements of Tuple B that are paired with an Int<0> with an Int<1>
@inline filter_zeros(a::Int, x) = iszero(a) ? 1 : x
filter_zeros(@nospecialize(x::IntTuple), @nospecialize(y::IntTuple)) = map(filter_zeros, x, y)
filter_zeros(@nospecialize t::Tuple) = filter_zeros(t, t)

function make_int_tuple(N::Int, t, n::Int, init::Int)
    ntuple(N) do i
        i ≤ n ? t[i] : init
    end
end

# fill_int_tuple_from

# make_int_tuple_from

function to_array(::Type{T}, @nospecialize(x::IntTuple)) where T
    x = flatten(x)
    N = length(x)
    result = Array{T}(undef, N)
    ntuple(N) do i
        @inbounds result[i] = x[i]
    end
    return result
end

# comparison
# Base.:(<)(x::Int, y::Tuple) = x < prod(y) # maybe we need this for non congruent shapes
#lex_less = <
#lex_leq = <=
#lex_geq = >=

colex_less(x::Int, y::Int) = x < y
colex_less(::Tuple{}, ::Tuple{}) = false
colex_less(::Tuple{}, ::Tuple) = true
colex_less(::Tuple, ::Tuple{}) = false
function colex_less(t1::Tuple, t2::Tuple)
    a, b = last(t1), last(t2)
    if a ≠ b
        return colex_less(a, b)
    end
    return colex_less(Base.front(t1), Base.front(t2))
end

elem_less(x::Int, y::Int) = x < y
elem_less(::Tuple{}, ::Tuple{}) = true
elem_less(::Tuple{}, ::Tuple) = true #  TupleA is exhausted
elem_less(::Tuple, ::Tuple{}) = false # TupleA is not exhausted, TupleB is exhausted

function elem_less(t1::Tuple, t2::Tuple)
    a, b = first(t1), first(t2)
    if length(t1) == length(t2) == 1
        return a < b
    end

    if !((a == b) || elem_less(a, b))
        return false
    end

    return elem_less(Base.tail(t1), Base.tail(t2))
end


elem_leq(x, y) = !elem_less(y, x)
elem_gtr(x, y) = elem_less(y, x)
elem_geq(x, y) = !elem_geq(x, y)
# increment

# iterator
