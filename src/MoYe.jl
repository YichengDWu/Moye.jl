module MoYe

using SimpleTraits
using Static: StaticInt, IntType, static, dynamic, is_static, One, Zero
import Static
import ManualMemory, LayoutPointers
import StrideArraysCore
using StrideArraysCore: @gc_preserve
using CUDA, BFloat16s, LLVM
using LLVMLoopInfo
using Core: LLVMPtr
import Adapt

include("utilities.jl")
include("algorithm/tuple_algorithms.jl")
include("int_tuple.jl")
include("stride.jl")
include("layout.jl")
include("print.jl")
include("engine.jl")

include("array.jl")
include("broadcast.jl")
include("algorithm/array_algorithms.jl")
include("algorithm/blas.jl")

include("pointer.jl")
include("device/smem.jl")

include("arch/mma.jl")
include("arch/copy/copy.jl")
include("arch/copy/copy_async.jl")
include("arch/copy/ldmatrix.jl")

include("traits/mma.jl")
include("traits/copy.jl")
include("traits/cp_async.jl")
include("traits/ldmatrix.jl")


include("algorithm/copy.jl")

# rexport
export static, @gc_preserve

# tuple algorithms
export flatten
export colex_less, elem_less, increment, capacity
export coord_to_index, index_to_coord, coord_to_coord, compact_col_major, compact_row_major,
       GenColMajor, GenRowMajor, @Layout, make_tuple

# layout
export Layout, make_layout, shape, rank, depth, cosize, complement, logical_product,
       blocked_product, raked_product, zipped_product, logical_divide, zipped_divide,
       tiled_divide, zeros!, recast, right_inverse
export print_layout

# MoYeArray
export ArrayEngine, ViewEngine, MoYeArray, make_fragment_like, @parallelize, @tile, zeros!
export MoYeSharedArray

# pointer
export isgmem, issmem, isrmem

# blas
export axpby!

# data movement
export cucopyto!, cp_async_wait, cp_async_commit

end
