var documenterSearchIndex = {"docs":
[{"location":"api/array/#CuTeArray","page":"CuTeArray","title":"CuTeArray","text":"","category":"section"},{"location":"api/array/","page":"CuTeArray","title":"CuTeArray","text":"CurrentModule = Shambles","category":"page"},{"location":"api/array/#Index","page":"CuTeArray","title":"Index","text":"","category":"section"},{"location":"api/array/","page":"CuTeArray","title":"CuTeArray","text":"Pages = [\"array.md\"]","category":"page"},{"location":"api/array/","page":"CuTeArray","title":"CuTeArray","text":"ViewEngine\nArrayEngine\nCuTeArray\nrecast","category":"page"},{"location":"api/array/#Shambles.ViewEngine","page":"CuTeArray","title":"Shambles.ViewEngine","text":"ViewEngine{T, P} <: Engine{T} <: DenseVector{T}\n\nA non-owning view of a memory buffer. P is the type of the pointer.\n\n\n\n\n\n","category":"type"},{"location":"api/array/#Shambles.ArrayEngine","page":"CuTeArray","title":"Shambles.ArrayEngine","text":"ArrayEngine{T, L} <: Engine{T} <: DenseVector{T}\n\nA owning vector of type T with length L. It is stack-allocated and mutable. It should behaves like a StaticStrideArray with from StrideArrays package.\n\nExamples\n\nfunction test_alloc()\n    x = ArrayEngine{Float32}(one, static(10))\n    @gc_preserve sum(x)\nend\n\n@test @allocated(test_alloc()) == 0\n\n\n\n\n\n","category":"type"},{"location":"api/array/#Shambles.CuTeArray","page":"CuTeArray","title":"Shambles.CuTeArray","text":"CuTeArray(engine::DenseVector, layout::Layout)\nCuTeArray{T}(::UndefInitializer, layout::StaticLayout)\nCuTeArray(ptr::Ptr{T}, layout::StaticLayout)\n\nCreate a CuTeArray from an engine and a layout. See also ArrayEngine and ViewEngine.\n\nExamples\n\njulia> slayout = @Layout (5, 2);\n\njulia> array_engine = ArrayEngine{Float32}(one, cosize(slayout));\n\njulia> CuTeArray(array_engine, slayout)\n5×2 CuTeArray{Float32, 2, ArrayEngine{Float32, 10}, Layout{2, Tuple{StaticInt{5}, StaticInt{2}}, Tuple{StaticInt{1}, StaticInt{5}}}} with indices One():static(5)×One():static(2):\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n\n julia> slayout = @Layout (5,3,2)\n(static(5), static(3), static(2)):(One(), static(5), static(15))\n\njulia> CuTeArray{Float32}(undef, slayout) # uninitialized owning array\n5×2 CuTeArray{Float32, 2, ArrayEngine{Float32, 10}, Layout{2, Tuple{Static.StaticInt{5}, Static.StaticInt{2}}, Tuple{Static.StaticInt{1}, Static.StaticInt{5}}}} with indices One():static(5)×One():static(2):\n -9.73642f-16   8.09f-43\n  8.09f-43     -1.64739f13\n  3.47644f36    8.09f-43\n  4.5914f-41    0.0\n -9.15084f-21   0.0\n\njulia> A = ones(10);\n\njulia> CuTeArray(pointer(A), slayout) # create a non-owning array\n5×2 CuTeArray{Float64, 2, ViewEngine{Float64, Ptr{Float64}}, Layout{2, Tuple{Static.StaticInt{5}, Static.StaticInt{2}}, Tuple{Static.StaticInt{1}, Static.StaticInt{5}}}} with indices One():static(5)×One():static(2):\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n 1.0  1.0\n\njulia> function test_alloc()  # when powered by a ArrayEngine, CuTeArray is stack-allocated\n    slayout = @Layout (2, 3)          # and mutable\n    x = CuTeArray{Float32}(undef, slayout)\n    fill!(x, 1.0f0)\n    return sum(x)\nend\ntest_alloc (generic function with 2 methods)\n\njulia> @allocated(test_alloc())\n0\n\n\n\n\n\n\n","category":"type"},{"location":"api/array/#Shambles.recast","page":"CuTeArray","title":"Shambles.recast","text":"recast(::Type{NewType}, x::CuTeArray{OldType}) -> CuTeArray{NewType}\n\nRecast the element type of a CuTeArray. This is similar to Base.reinterpret, but dose all the computation at compile time, if possible.\n\nExamples\n\njulia> x = CuTeArray{Int32}(undef, @Layout((2,3)))\n2×3 CuTeArray{Int32, 2, ArrayEngine{Int32, 6}, Layout{2, Tuple{Static.StaticInt{2}, Static.StaticInt{3}}, Tuple{Static.StaticInt{1}, Static.StaticInt{2}}}}:\n -1948408944           0  2\n         514  -268435456  0\n\njulia> x2 = recast(Int16, x)\n4×3 CuTeArray{Int16, 2, ViewEngine{Int16, Ptr{Int16}}, Layout{2, Tuple{Static.StaticInt{4}, Static.StaticInt{3}}, Tuple{Static.StaticInt{1}, Static.StaticInt{4}}}}:\n -23664      0  2\n -29731      0  0\n    514      0  0\n      0  -4096  0\n\njulia> x3 = recast(Int64, x)\n1×3 CuTeArray{Int64, 2, ViewEngine{Int64, Ptr{Int64}}, Layout{2, Tuple{Static.StaticInt{1}, Static.StaticInt{3}}, Tuple{Static.StaticInt{1}, Static.StaticInt{1}}}}:\n 2209959748496  -1152921504606846976  2\n\n\n\n\n\n","category":"function"},{"location":"api/tiling/","page":"Tiling","title":"Tiling","text":"CurrentModule = Shambles","category":"page"},{"location":"api/tiling/#Index","page":"Tiling","title":"Index","text":"","category":"section"},{"location":"api/tiling/","page":"Tiling","title":"Tiling","text":"Pages = [\"tiling.md\"]","category":"page"},{"location":"api/tiling/","page":"Tiling","title":"Tiling","text":"Tile\nlocal_tile\nlocal_partition","category":"page"},{"location":"api/tiling/#Shambles.Tile","page":"Tiling","title":"Shambles.Tile","text":"A tuple of Layouts, Colons or integers.\n\n\n\n\n\n","category":"type"},{"location":"api/tiling/#Shambles.local_tile","page":"Tiling","title":"Shambles.local_tile","text":"local_tile(@nospecialize(x::CuTeArray), tile::Tile, coord::Tuple)\n\nPartition a CuTeArray x into tiles. This is similar to local_partition but not parallelised.\n\njulia> a = CuTeArray(pointer([i for i in 1:48]), @Layout((6,8)))\n\njulia> local_tile(a, (static(2), static(2)), (One(), One()))\n2×2 CuTeArray{Int64, 2, ViewEngine{Int64, Ptr{Int64}}, Layout{2, Tuple{StaticInt{2}, StaticInt{2}}, Tuple{StaticInt{1}, StaticInt{6}}}}:\n 1  7\n 2  8\n\n\n\n\n\n","category":"function"},{"location":"api/tiling/#Shambles.local_partition","page":"Tiling","title":"Shambles.local_partition","text":"local_partition(x::CuTeArray, tile::Tile, coord::Tuple)\nlocal_partition(x::CuTeArray, thread_layout::Layout, thread_id::Integer)\n\nPartition a CuTeArray x into tiles that are parallised over.\n\nExamples\n\nSay we have a CuTeArray x of shape (6, 8) and 4 threads of shape (2, 2). We would like to  partition x with the 4 threads and get a view of the entries that the first thread will work on. We can do this by calling local_partition(x, (2, 2), 1).\n\njulia> a = CuTeArray(pointer([i for i in 1:48]), @Layout((6,8)))\n6×8 CuTeArray{Int64, 2, ViewEngine{Int64, Ptr{Int64}}, Layout{2, Tuple{Static.StaticInt{6}, Static.StaticInt{8}}, Tuple{Static.StaticInt{1}, Static.StaticInt{6}}}}:\n 1   7  13  19  25  31  37  43\n 2   8  14  20  26  32  38  44\n 3   9  15  21  27  33  39  45\n 4  10  16  22  28  34  40  46\n 5  11  17  23  29  35  41  47\n 6  12  18  24  30  36  42  48\n\njulia> local_partition(a, (static(2), static(2)), (One(), One()))\n3×4 CuTeArray{Int64, 2, ViewEngine{Int64, Ptr{Int64}}, Layout{2, Tuple{Static.StaticInt{3}, Static.StaticInt{4}}, Tuple{Static.StaticInt{2}, Static.StaticInt{12}}}}:\n 1  13  25  37\n 3  15  27  39\n 5  17  29  41\n\nYou can also pass in a thread layout and a thread id to get the tile:\n\njulia> local_partition(a, @Layout((2,2), (1, 2)), 2)\n3×4 CuTeArray{Int64, 2, ViewEngine{Int64, Ptr{Int64}}, Layout{2, Tuple{StaticInt{3}, StaticInt{4}}, Tuple{StaticInt{2}, StaticInt{12}}}}:\n 2  14  26  38\n 4  16  28  40\n 6  18  30  42\n\njulia> local_partition(a, @Layout((2,2), (2, 1)), 2)\n3×4 CuTeArray{Int64, 2, ViewEngine{Int64, Ptr{Int64}}, Layout{2, Tuple{StaticInt{3}, StaticInt{4}}, Tuple{StaticInt{2}, StaticInt{12}}}}:\n  7  19  31  43\n  9  21  33  45\n 11  23  35  47\n\n\n\n\n\n","category":"function"},{"location":"api/copy/#Data-Movement","page":"-","title":"Data Movement","text":"","category":"section"},{"location":"api/copy/","page":"-","title":"-","text":"CurrentModule = Shambles","category":"page"},{"location":"api/copy/#Index","page":"-","title":"Index","text":"","category":"section"},{"location":"api/copy/","page":"-","title":"-","text":"Pages = [\"copy.md\"]","category":"page"},{"location":"api/copy/","page":"-","title":"-","text":"cucopyto!","category":"page"},{"location":"api/copy/#Shambles.cucopyto!","page":"-","title":"Shambles.cucopyto!","text":"cucopyto!(dest::CuTeArray, src::CuTeArray)\n\nCopy the contents of src to dest. The function automatically carries out potential vectorization. In particular, while transferring data from global memory to shared memory, it automatically initiates asynchronous copying, if your device supports so.\n\nnote: Note\nIt should be used with @gc_preserve if dest or src is powered by an ArrayEngine.\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Layout","page":"Layout","title":"Layout","text":"","category":"section"},{"location":"api/layout/","page":"Layout","title":"Layout","text":"CurrentModule = Shambles","category":"page"},{"location":"api/layout/#Index","page":"Layout","title":"Index","text":"","category":"section"},{"location":"api/layout/","page":"Layout","title":"Layout","text":"Pages = [\"layout.md\"]","category":"page"},{"location":"api/layout/#Constructors","page":"Layout","title":"Constructors","text":"","category":"section"},{"location":"api/layout/","page":"Layout","title":"Layout","text":"@Layout\nmake_layout\nmake_ordered_layout\nmake_fragment_like","category":"page"},{"location":"api/layout/#Shambles.@Layout","page":"Layout","title":"Shambles.@Layout","text":"Layout(shape, stride=nothing)\n\nConstruct a static layout with the given shape and stride.\n\nArguments\n\nshape: a tuple of integers or a single integer\nstride: a tuple of integers, a single integer, GenColMajor or GenRowMajor\n\n\n\n\n\n","category":"macro"},{"location":"api/layout/#Shambles.make_ordered_layout","page":"Layout","title":"Shambles.make_ordered_layout","text":"make_ordered_layout(shape, order)\nmake_ordered_layout(layout)\n\nConstruct a compact layout with the given shape and the stride is following the given order.\n\nExamples\n\njulia> Shambles.make_ordered_layout((3, 5), (2, 6))\n(3, 5):(One(), 3)\n\njulia> Shambles.make_ordered_layout((3, 5), (10, 2))\n(3, 5):(5, One())\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Shambles.make_fragment_like","page":"Layout","title":"Shambles.make_fragment_like","text":"make_fragment_like(::Layout) -> Layout\nmake_fragment_like(T, ::CuTeArray) -> CuTeArray\n\nMake a compact layout of the same shape with the first mode being col-major, and with the rest following the given order.\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Product","page":"Layout","title":"Product","text":"","category":"section"},{"location":"api/layout/","page":"Layout","title":"Layout","text":"logical_product\nblocked_product\nraked_product","category":"page"},{"location":"api/layout/#Shambles.logical_product","page":"Layout","title":"Shambles.logical_product","text":"logical_product(A::Layout, B::Layout)\n\nCompute the logical product of two layouts. Indexing through the first mode of the new layout corresponds to indexing through A and indexing through the second mode corresponds to indexing through B.\n\njulia> tile = @Layout((2,2), (1,2));\n\njulia> print_layout(tile)\n(static(2), static(2)):(static(1), static(2))\n      1   2\n    +---+---+\n 1  | 1 | 3 |\n    +---+---+\n 2  | 2 | 4 |\n    +---+---+\n\njulia> matrix_of_tiles = @Layout((3,4), (4,1));\n\njulia> print_layout(matrix_of_tiles)\n(static(3), static(4)):(static(4), static(1))\n       1    2    3    4\n    +----+----+----+----+\n 1  |  1 |  2 |  3 |  4 |\n    +----+----+----+----+\n 2  |  5 |  6 |  7 |  8 |\n    +----+----+----+----+\n 3  |  9 | 10 | 11 | 12 |\n    +----+----+----+----+\n\njulia> print_layout(logical_product(tile, matrix_of_tiles))\n((static(2), static(2)), (static(3), static(4))):((static(1), static(2)), (static(16), static(4)))\n       1    2    3    4    5    6    7    8    9   10   11   12\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 1  |  1 | 17 | 33 |  5 | 21 | 37 |  9 | 25 | 41 | 13 | 29 | 45 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 2  |  2 | 18 | 34 |  6 | 22 | 38 | 10 | 26 | 42 | 14 | 30 | 46 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 3  |  3 | 19 | 35 |  7 | 23 | 39 | 11 | 27 | 43 | 15 | 31 | 47 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 4  |  4 | 20 | 36 |  8 | 24 | 40 | 12 | 28 | 44 | 16 | 32 | 48 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Shambles.blocked_product","page":"Layout","title":"Shambles.blocked_product","text":"blocked_product(tile::Layout, matrix_of_tiles::Layout, coalesce_result::Bool=false)\n\nCompute the blocked product of two layouts. Indexing through the first mode of the new layout corresponds to indexing through the cartesian product of the first mode of tile and the first mode of matrix_of_tiles. Indexing through the second mode is similar. If coalesce_result is true, then the result is coalesced.\n\njulia> tile = @Layout (2, 2);\n\njulia> matrix_of_tiles = @Layout (3, 4) (4, 1);\n\njulia> print_layout(blocked_product(tile, matrix_of_tiles))\n((static(2), static(3)), (static(2), static(4))):((static(1), static(16)), (static(2), static(4)))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  3 |  5 |  7 |  9 | 11 | 13 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  |  2 |  4 |  6 |  8 | 10 | 12 | 14 | 16 |\n    +----+----+----+----+----+----+----+----+\n 3  | 17 | 19 | 21 | 23 | 25 | 27 | 29 | 31 |\n    +----+----+----+----+----+----+----+----+\n 4  | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 |\n    +----+----+----+----+----+----+----+----+\n 5  | 33 | 35 | 37 | 39 | 41 | 43 | 45 | 47 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 36 | 38 | 40 | 42 | 44 | 46 | 48 |\n    +----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Shambles.raked_product","page":"Layout","title":"Shambles.raked_product","text":"raked_product(tile::Layout, matrix_of_tiles::Layout, coalesce_result::Bool=false)\n\nThe tile is shattered or interleaved with the matrix of tiles.\n\njulia> tile = @Layout (2, 2) (1, 2);\n\njulia> matrix_of_tiles = @Layout (3, 4) (4, 1);\n\njulia> print_layout(raked_product(tile, matrix_of_tiles))\n((static(3), static(2)), (static(4), static(2))):((static(16), static(1)), (static(4), static(2)))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  5 |  9 | 13 |  3 |  7 | 11 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  | 17 | 21 | 25 | 29 | 19 | 23 | 27 | 31 |\n    +----+----+----+----+----+----+----+----+\n 3  | 33 | 37 | 41 | 45 | 35 | 39 | 43 | 47 |\n    +----+----+----+----+----+----+----+----+\n 4  |  2 |  6 | 10 | 14 |  4 |  8 | 12 | 16 |\n    +----+----+----+----+----+----+----+----+\n 5  | 18 | 22 | 26 | 30 | 20 | 24 | 28 | 32 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 38 | 42 | 46 | 36 | 40 | 44 | 48 |\n    +----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Division","page":"Layout","title":"Division","text":"","category":"section"},{"location":"api/layout/","page":"Layout","title":"Layout","text":"logical_divide\nzipped_divide\ntiled_divide","category":"page"},{"location":"api/layout/#Shambles.logical_divide","page":"Layout","title":"Shambles.logical_divide","text":"logical_divide(layout::Layout, tile::Tile)\n\nGather the elements of layout along all modes into blocks according to tile.\n\njulia> raked_prod = @Layout ((3, 2), (4, 2)) ((16, 1), (4, 2));\n\njulia> print_layout(raked_prod)\n((static(3), static(2)), (static(4), static(2))):((static(16), static(1)), (static(4), static(2)))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  5 |  9 | 13 |  3 |  7 | 11 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  | 17 | 21 | 25 | 29 | 19 | 23 | 27 | 31 |\n    +----+----+----+----+----+----+----+----+\n 3  | 33 | 37 | 41 | 45 | 35 | 39 | 43 | 47 |\n    +----+----+----+----+----+----+----+----+\n 4  |  2 |  6 | 10 | 14 |  4 |  8 | 12 | 16 |\n    +----+----+----+----+----+----+----+----+\n 5  | 18 | 22 | 26 | 30 | 20 | 24 | 28 | 32 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 38 | 42 | 46 | 36 | 40 | 44 | 48 |\n    +----+----+----+----+----+----+----+----+\n\njulia> subtile = (Layout(2, 3), Layout(2, 4)); # gather 2 elements with stride 3 along the first mode\n       # and 2 elements with stride 4 along the second mode\n\n\njulia> print_layout(logical_divide(raked_prod, subtile))\n(((1, 2), ((3, 1), (1, 1))), ((1, 2), ((4, 1), (1, 1)))):(((48, 1), ((static(16), static(1)), (48, 2))), ((16, 2), ((static(4), static(2)), (16, 4))))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  3 |  5 |  7 |  9 | 11 | 13 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  |  2 |  4 |  6 |  8 | 10 | 12 | 14 | 16 |\n    +----+----+----+----+----+----+----+----+\n 3  | 17 | 19 | 21 | 23 | 25 | 27 | 29 | 31 |\n    +----+----+----+----+----+----+----+----+\n 4  | 18 | 20 | 22 | 24 | 26 | 28 | 30 | 32 |\n    +----+----+----+----+----+----+----+----+\n 5  | 33 | 35 | 37 | 39 | 41 | 43 | 45 | 47 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 36 | 38 | 40 | 42 | 44 | 46 | 48 |\n    +----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Shambles.zipped_divide","page":"Layout","title":"Shambles.zipped_divide","text":"zipped_divide(layout::Layout, tile::Tile)\n\nCompute the logical division of layout by tile, then flatten the blocks into the first mode and the rest into the second mode.\n\njulia> raked_prod = @Layout ((3, 2), (4, 2)) ((16, 1), (4, 2));\n\njulia> print_layout(raked_prod)\n((static(3), static(2)), (static(4), static(2))):((static(16), static(1)), (static(4), static(2)))\n       1    2    3    4    5    6    7    8\n    +----+----+----+----+----+----+----+----+\n 1  |  1 |  5 |  9 | 13 |  3 |  7 | 11 | 15 |\n    +----+----+----+----+----+----+----+----+\n 2  | 17 | 21 | 25 | 29 | 19 | 23 | 27 | 31 |\n    +----+----+----+----+----+----+----+----+\n 3  | 33 | 37 | 41 | 45 | 35 | 39 | 43 | 47 |\n    +----+----+----+----+----+----+----+----+\n 4  |  2 |  6 | 10 | 14 |  4 |  8 | 12 | 16 |\n    +----+----+----+----+----+----+----+----+\n 5  | 18 | 22 | 26 | 30 | 20 | 24 | 28 | 32 |\n    +----+----+----+----+----+----+----+----+\n 6  | 34 | 38 | 42 | 46 | 36 | 40 | 44 | 48 |\n    +----+----+----+----+----+----+----+----+\n\njulia> subtile = (@Layout(2, 3), @Layout(2, 4)); # gather 2 elements with stride 3 along the first mode and 2 elements with stride 4 along the second mode\n\njulia> print_layout(zipped_divide(raked_prod, subtile))\n((static(2), static(2)), (static(3), static(4))):((static(1), static(2)), (static(16), static(4)))\n       1    2    3    4    5    6    7    8    9   10   11   12\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 1  |  1 | 17 | 33 |  5 | 21 | 37 |  9 | 25 | 41 | 13 | 29 | 45 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 2  |  2 | 18 | 34 |  6 | 22 | 38 | 10 | 26 | 42 | 14 | 30 | 46 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 3  |  3 | 19 | 35 |  7 | 23 | 39 | 11 | 27 | 43 | 15 | 31 | 47 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n 4  |  4 | 20 | 36 |  8 | 24 | 40 | 12 | 28 | 44 | 16 | 32 | 48 |\n    +----+----+----+----+----+----+----+----+----+----+----+----+\n\n\n\n\n\n","category":"function"},{"location":"api/layout/#Shambles.tiled_divide","page":"Layout","title":"Shambles.tiled_divide","text":"tiled_divide(layout::Layout, tile::Tile)\n\nSimilar to zipped_divide, but upack the second mode into multiple modes.\n\n\n\n\n\n","category":"function"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = Shambles","category":"page"},{"location":"#Shambles","page":"Home","title":"Shambles","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for Shambles.","category":"page"},{"location":"manual/layout/#Layout","page":"Layout","title":"Layout","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"Mathematically, a Layout represents a function that maps logical coordinates to physical 1-D index spaces. It consists of a Shape and a Stride, wherein the Shape determines the domain, and the Stride establishes the mapping through an inner product.","category":"page"},{"location":"manual/layout/#Constructing-a-Layout","page":"Layout","title":"Constructing a Layout","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"layout_2x4 = make_layout((2, (2, 2)), (4, (1, 2)))\nprint(\"Shape: \", shape(layout_2x4))\nprint(\"Stride: \", stride(layout_2x4))\nprint(\"Size: \", size(layout_2x4)) # the domain is (1,2,...,8)\nprint(\"Rank: \", rank(layout_2x4))\nprint(\"Depth: \", depth(layout_2x4))\nprint(\"Cosize: \", cosize(layout_2x4)) \n(layout_2x4) # this can be viewed as a row-major matrix","category":"page"},{"location":"manual/layout/#Compile-time-ness-of-values","page":"Layout","title":"Compile-time-ness of values","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"You can also use static integers:","category":"page"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"static_layout = @Layout (2, (2, 2)) (4, (1, 2))\ntypeof(static_layout)\nsizeof(static_layout)\n","category":"page"},{"location":"manual/layout/#Coordinate-space","page":"Layout","title":"Coordinate space","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"The coordinate space of a Layout is determined by its Shape. This coordinate space can be viewed in three different ways:","category":"page"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"h-D coordinate space: Each element in this space possesses the exact hierarchical structure as defined by the Shape. Here h stands for \"hierarchical\".\n1-D coordinate space: This can be visualized as the colexicographically flattening of the coordinate space into a one-dimensional space.\nR-D coordinate space: In this space, each element has the same rank as the Shape, but each mode (top-level axis) of the Shape is colexicographically flattened into a one-dimensional space. Here R stands for the rank of the layout.","category":"page"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"layout_2x4(2, (1, 2)) # h-D coordinate\nlayout_2x4(2, 3) # R-D coordinate\nlayout_2x4(6) # 1-D coordinate","category":"page"},{"location":"manual/layout/#Concatenation","page":"Layout","title":"Concatenation","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"A layout can be expressed as the concatenation of its sublayouts.","category":"page"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"layout_2x4[2] # get the second sublayout\ntuple(layout_2x4...) # splatting a layout into sublayouts\nmake_layout(layout_2x4...) # concatenating sublayouts\nfor sublayout in layout_2x4 # iterating a layout\n   @show sublayout\nend","category":"page"},{"location":"manual/layout/#Flatten","page":"Layout","title":"Flatten","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"layout = make_layout(((4, 3), 1), ((3, 1), 0))\nprint(flatten(layout))","category":"page"},{"location":"manual/layout/#Coalesce","page":"Layout","title":"Coalesce","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"layout = @Layout (2, (1, 6)) (1, (6, 2)) # layout has to be static\nprint(coalesce(layout))","category":"page"},{"location":"manual/layout/#Composition","page":"Layout","title":"Composition","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"Layouts are functions and thus can possibly be composed.","category":"page"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"make_layout(20, 2) ∘ make_layout((4, 5), (1, 4)) \nmake_layout(20, 2) ∘ make_layout((4, 5), (5, 1))","category":"page"},{"location":"manual/layout/#Complement","page":"Layout","title":"Complement","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"complement(@Layout(4, 1), static(24))\ncomplement(@Layout(6, 4), static(24))","category":"page"},{"location":"manual/layout/#Product","page":"Layout","title":"Product","text":"","category":"section"},{"location":"manual/layout/#Logical-product","page":"Layout","title":"Logical product","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"tile = make_layout((2,2), (1,2));\nprint_layout(tile)\nmatrix_of_tiles = make_layout((3,4), (4,1));\nprint_layout(matrix_of_tiles)\nprint_layout(logical_product(tile, matrix_of_tiles))","category":"page"},{"location":"manual/layout/#Blocked-product","page":"Layout","title":"Blocked product","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"print_layout(blocked_product(tile, matrix_of_tiles))","category":"page"},{"location":"manual/layout/#Raked-product","page":"Layout","title":"Raked product","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"print_layout(raked_product(tile, matrix_of_tiles))","category":"page"},{"location":"manual/layout/#Division","page":"Layout","title":"Division","text":"","category":"section"},{"location":"manual/layout/#Logical-division","page":"Layout","title":"Logical division","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"raked_prod = raked_product(tile, matrix_of_tiles);\nsubtile = (Layout(2,3), Layout(2,4));\nprint_layout(logical_divide(raked_prod, subtile))","category":"page"},{"location":"manual/layout/#Zipped-division","page":"Layout","title":"Zipped division","text":"","category":"section"},{"location":"manual/layout/","page":"Layout","title":"Layout","text":"print_layout(zipped_divide(raked_prod, subtile))","category":"page"}]
}
