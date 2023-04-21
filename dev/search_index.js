var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = CuTe","category":"page"},{"location":"#CuTe","page":"Home","title":"CuTe","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for CuTe.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [CuTe]","category":"page"},{"location":"#CuTe.ArrayEngine","page":"Home","title":"CuTe.ArrayEngine","text":"ArrayEngine{T, L} <: Engine{T} <: DenseVector{T}\n\nA owning vector of type T with length L. It is stack-allocated and mutable. It should behaves like a StaticStrideArray with from StrideArrays package.\n\nExamples\n\nfunction test_alloc()\n    x = ArrayEngine{Float32}(one, static(10))\n    GC.@preserve x begin sum(ViewEngine(x)) end\nend\n\n@test @allocated(test_alloc()) == 0\n\n\n\n\n\n","category":"type"},{"location":"#CuTe.CuTeArray","page":"Home","title":"CuTe.CuTeArray","text":"CuTeArray(engine::DenseVector, layout::Layout)\nCuTeArray{T}(::UndefInitializer, layout::StaticLayout)\nCuTeArray(ptr::Ptr{T}, layout::StaticLayout)\n\nCreate a CuTeArray from an engine and a layout. See also ArrayEngine and ViewEngine.\n\nExamples\n\njulia> slayout = @Layout (5, 2);\n\njulia> array_engine = ArrayEngine{Float32}(one, cosize(slayout));\n\njulia> CuTeArray(array_engine, slayout)\n5×2 CuTeArray{Float32, 2, ArrayEngine{Float32, 10}, Layout{2, Tuple{StaticInt{5}, StaticInt{2}}, Tuple{StaticInt{1}, StaticInt{5}}}} with indices static(1):static(5)×static(1):static(2):\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n\n julia> slayout = @Layout (5,3,2)\n(static(5), static(3), static(2)):(static(1), static(5), static(15))\n\njulia> CuTeArray{Float32}(undef, slayout) # uninitialized owning array\n5×2 CuTeArray{Float32, 2, ArrayEngine{Float32, 10}, Layout{2, Tuple{Static.StaticInt{5}, Static.StaticInt{2}}, Tuple{Static.StaticInt{1}, Static.StaticInt{5}}}} with indices static(1):static(5)×static(1):static(2):\n -9.73642f-16   8.09f-43\n  8.09f-43     -1.64739f13\n  3.47644f36    8.09f-43\n  4.5914f-41    0.0\n -9.15084f-21   0.0\n\njulia> A = ones(10);\n\njulia> CuTeArray(pointer(A), slayout) # create a non-owning array\n5×2 CuTeArray{Float64, 2, ViewEngine{Float64, Ptr{Float64}}, Layout{2, Tuple{Static.StaticInt{5}, Static.StaticInt{2}}, Tuple{Static.StaticInt{1}, Static.StaticInt{5}}}} with indices static(1):static(5)×static(1):static(2):\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n\njulia> function test_alloc()  # when powered by a ArrayEngine, CuTeArray is stack-allocated\n    slayout = @Layout (2, 3)          # and mutable\n    x = CuTeArray{Float32}(undef, slayout)\n    fill!(x, 1.0f0)\n    return sum(x)\nend\ntest_alloc (generic function with 2 methods)\n\njulia> @allocated(test_alloc())\n0\n\n\n\n\n\n\n","category":"type"},{"location":"#CuTe.Tile","page":"Home","title":"CuTe.Tile","text":"A tuple of Layouts or Colons.\n\n\n\n\n\n","category":"type"},{"location":"#CuTe.ViewEngine","page":"Home","title":"CuTe.ViewEngine","text":"ViewEngine{T, P} <: Engine{T} <: DenseVector{T}\n\nA non-owning view of a memory buffer. P is the type of the pointer.\n\n\n\n\n\n","category":"type"},{"location":"#CuTe.blocked_product-Union{Tuple{M}, Tuple{N}, Tuple{Layout{N}, Layout{M}}, Tuple{Layout{N}, Layout{M}, Bool}} where {N, M}","page":"Home","title":"CuTe.blocked_product","text":"blocked_product(tile::Layout, matrix_of_tiles::Layout, coalesce_result::Bool=false)\n\nCompute the blocked product of two layouts. Indexing through the first mode of the new layout corresponds to indexing through the cartesian product of the first mode of tile and the first mode of matrix_of_tiles. Indexing through the second mode is similar. If coalesce_result is true, then the result is coalesced.\n\njulia> tile = make_layout((2, 2), (1, 2));\n\njulia> matrix_of_tiles = make_layout((3, 4), (4, 1));\n\njulia> print_layout(blocked_product(tile, matrix_of_tiles))\n\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.coord_to_coord-Tuple{Tuple, Tuple, Tuple}","page":"Home","title":"CuTe.coord_to_coord","text":"Transoform a coordinate in one shape to a coordinate in another shape.\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.logical_divide-Tuple{Layout, Layout}","page":"Home","title":"CuTe.logical_divide","text":"logical_divide(layout::Layout, tile::Tile)\n\nGather the elements of layout along all modes into blocks according to tile.\n\njulia> raked_prod = make_layout(((3, 2), (4, 2)), ((16, 1), (4, 2)));\n\njulia> print_layout(raked_prod)\n((3, 2), (4, 2)):((16, 1), (4, 2))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  5 |  9 | 13 |  3 |  7 | 11 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  | 17 | 21 | 25 | 29 | 19 | 23 | 27 | 31 |\n    +----+----+----+----+----+----+----+----+\n 3  | 33 | 37 | 41 | 45 | 35 | 39 | 43 | 47 |\n    +----+----+----+----+----+----+----+----+\n 4  |  2 |  6 | 10 | 14 |  4 |  8 | 12 | 16 |\n    +----+----+----+----+----+----+----+----+\n 5  | 18 | 22 | 26 | 30 | 20 | 24 | 28 | 32 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 38 | 42 | 46 | 36 | 40 | 44 | 48 |\n    +----+----+----+----+----+----+----+----+\n\njulia> subtile = (Layout(2, 3), Layout(2, 4)); # gather 2 elements with stride 3 along the first mode\n       # and 2 elements with stride 4 along the second mode\n\njulia> print_layout(logical_divide(raked_prod, subtile))\n((2, 3), (2, 4)):((1, 16), (2, 4))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  3 |  5 |  7 |  9 | 11 | 13 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  |  2 |  4 |  6 |  8 | 10 | 12 | 14 | 16 |\n    +----+----+----+----+----+----+----+----+\n 3  | 17 | 19 | 21 | 23 | 25 | 27 | 29 | 31 |\n    +----+----+----+----+----+----+----+----+\n 4  | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 |\n    +----+----+----+----+----+----+----+----+\n 5  | 33 | 35 | 37 | 39 | 41 | 43 | 45 | 47 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 36 | 38 | 40 | 42 | 44 | 46 | 48 |\n    +----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.logical_product-Tuple{Layout, Layout}","page":"Home","title":"CuTe.logical_product","text":"logical_product(A::Layout, B::Layout)\n\nCompute the logical product of two layouts. Indexing through the first mode of the new layout corresponds to indexing through A and indexing through the second mode corresponds to indexing through B.\n\njulia> print_layout(tile)\ntile = make_layout((2,2), (1,2));\n\njulia> print_layout(matrix_of_tiles)\n(2, 2):(1, 2)\n      1   2\n    +---+---+\n 1  | 1 | 3 |\n    +---+---+\n 2  | 2 | 4 |\n    +---+---+\n\njulia> print_layout(logical_product(tile, matrix_of_tiles));\nmatrix_of_tiles = make_layout((3,4), (4,1));\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.make_fragment_like-Tuple{Layout{1, <:Union{Tuple{Union{Tuple{Vararg{Union{Tuple, Static.StaticInt}}}, Static.StaticInt}}, Static.StaticInt}, <:Union{Tuple{Union{Tuple{Vararg{Union{Tuple, Static.StaticInt}}}, Static.StaticInt}}, Static.StaticInt}}}","page":"Home","title":"CuTe.make_fragment_like","text":"make_fragment_like(::Layout)\n\nMake a compact layout of the same shape with the first mode being col-major, and with the rest following the given order.\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.make_ordered_layout-Tuple{Any, Any}","page":"Home","title":"CuTe.make_ordered_layout","text":"make_ordered_layout(shape, order)\nmake_ordered_layout(layout)\n\nConstruct a compact layout with the given shape and the stride is following the given order.\n\nExamples\n\njulia> CuTe.make_ordered_layout((3, 5), (2, 6))\n(3, 5):(static(1), 3)\n\njulia> CuTe.make_ordered_layout((3, 5), (10, 2))\n(3, 5):(5, static(1))\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.raked_product-Union{Tuple{M}, Tuple{N}, Tuple{Layout{N}, Layout{M}}, Tuple{Layout{N}, Layout{M}, Bool}} where {N, M}","page":"Home","title":"CuTe.raked_product","text":"raked_product(tile::Layout, matrix_of_tiles::Layout, coalesce_result::Bool=false)\n\nThe tile is shattered or interleaved with the matrix of tiles.\n\njulia> tile = make_layout((2, 2), (1, 2));\n\njulia> matrix_of_tiles = make_layout((3, 4), (4, 1));\n\njulia> print_layout(raked_product(tile, matrix_of_tiles))\n((3, 2), (4, 2)):((16, 1), (4, 2))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  5 |  9 | 13 |  3 |  7 | 11 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  | 17 | 21 | 25 | 29 | 19 | 23 | 27 | 31 |\n    +----+----+----+----+----+----+----+----+\n 3  | 33 | 37 | 41 | 45 | 35 | 39 | 43 | 47 |\n    +----+----+----+----+----+----+----+----+\n 4  |  2 |  6 | 10 | 14 |  4 |  8 | 12 | 16 |\n    +----+----+----+----+----+----+----+----+\n 5  | 18 | 22 | 26 | 30 | 20 | 24 | 28 | 32 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 38 | 42 | 46 | 36 | 40 | 44 | 48 |\n    +----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.tiled_divide-Tuple{Layout, Tuple{Vararg{Union{Colon, Layout}, N}} where N}","page":"Home","title":"CuTe.tiled_divide","text":"tiled_divide(layout::Layout, tile::Tile)\n\nSimilar to zipped_divide, but upack the second mode into multiple modes.\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.zipped_divide-Tuple{Layout, Tuple{Vararg{Union{Colon, Layout}, N}} where N}","page":"Home","title":"CuTe.zipped_divide","text":"zipped_divide(layout::Layout, tile::Tile)\n\nCompute the logical division of layout by tile, then flatten the blocks into single mode and the rest into another mode.\n\njulia> raked_prod = make_layout(((3, 2), (4, 2)), ((16, 1), (4, 2)));\n\njulia> print_layout(raked_prod)\n\njulia> subtile = (Layout(2, 3), Layout(2, 4)); # gather 2 elements with stride 3 along the first mode\n       # and 2 elements with stride 4 along the second mode\n((3, 2), (4, 2)):((16, 1), (4, 2))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  5 |  9 | 13 |  3 |  7 | 11 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  | 17 | 21 | 25 | 29 | 19 | 23 | 27 | 31 |\n    +----+----+----+----+----+----+----+----+\n 3  | 33 | 37 | 41 | 45 | 35 | 39 | 43 | 47 |\n    +----+----+----+----+----+----+----+----+\n 4  |  2 |  6 | 10 | 14 |  4 |  8 | 12 | 16 |\n    +----+----+----+----+----+----+----+----+\n 5  | 18 | 22 | 26 | 30 | 20 | 24 | 28 | 32 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 38 | 42 | 46 | 36 | 40 | 44 | 48 |\n    +----+----+----+----+----+----+----+----+\n\njulia> print_layout(zipped_divide(raked_prod, subtile))\n\n\n\n\n\n\n","category":"method"},{"location":"#CuTe.@Layout","page":"Home","title":"CuTe.@Layout","text":"Layout(shape, stride=nothing)\n\nConstruct a static layout with the given shape and stride.\n\nArguments\n\nshape: a tuple of integers or a single integer\nstride: a tuple of integers, a single integer, GenColMajor or GenRowMajor\n\n\n\n\n\n","category":"macro"}]
}
