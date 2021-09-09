import { createAlgorithm02 } from '../../type/matrix/utils/algorithm02.js'
import { createAlgorithm11 } from '../../type/matrix/utils/algorithm11.js'
import { createAlgorithm13 } from '../../type/matrix/utils/algorithm13.js'
import { createAlgorithm14 } from '../../type/matrix/utils/algorithm14.js'
import { createAlgorithm01 } from '../../type/matrix/utils/algorithm01.js'
import { createAlgorithm10 } from '../../type/matrix/utils/algorithm10.js'
import { createAlgorithm08 } from '../../type/matrix/utils/algorithm08.js'
import { factory } from '../../utils/factory.js'
import { leftShiftNumber } from '../../plain/number/index.js'
import { leftShiftBigNumber } from '../../utils/bignumber/bitwise.js'

const name = 'leftShift'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'zeros',
  'DenseMatrix'
]

export const createLeftShift = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, zeros, DenseMatrix }) => {
  const algorithm01 = createAlgorithm01({ typed })
  const algorithm02 = createAlgorithm02({ typed, equalScalar })
  const algorithm08 = createAlgorithm08({ typed, equalScalar })
  const algorithm10 = createAlgorithm10({ typed, DenseMatrix })
  const algorithm11 = createAlgorithm11({ typed, equalScalar })
  const algorithm13 = createAlgorithm13({ typed })
  const algorithm14 = createAlgorithm14({ typed })

  /**
   * Bitwise left logical shift of a value x by y number of bits, `x << y`.
   * For matrices, the function is evaluated element wise.
   * For units, the function is evaluated on the best prefix base.
   *
   * Syntax:
   *
   *    math.leftShift(x, y)
   *
   * Examples:
   *
   *    math.leftShift(1, 2)               // returns number 4
   *
   *    math.leftShift([1, 2, 3], 4)       // returns Array [16, 32, 64]
   *
   * See also:
   *
   *    leftShift, bitNot, bitOr, bitXor, rightArithShift, rightLogShift
   *
   * @param  {number | BigNumber | Array | Matrix} x Value to be shifted
   * @param  {number | BigNumber} y Amount of shifts
   * @return {number | BigNumber | Array | Matrix} `x` shifted left `y` times
   */
  return typed(name, {

    'number, number': leftShiftNumber,

    'BigNumber, BigNumber': leftShiftBigNumber,

    'SparseMatrix, SparseMatrix': function (x, y) {
      return algorithm08(x, y, this, false)
    },

    'SparseMatrix, DenseMatrix': function (x, y) {
      return algorithm02(y, x, this, true)
    },

    'DenseMatrix, SparseMatrix': function (x, y) {
      return algorithm01(x, y, this, false)
    },

    'DenseMatrix, DenseMatrix': function (x, y) {
      return algorithm13(x, y, this)
    },

    'Array, Array': function (x, y) {
      // use matrix implementation
      return this(matrix(x), matrix(y)).valueOf()
    },

    'Array, Matrix': function (x, y) {
      // use matrix implementation
      return this(matrix(x), y)
    },

    'Matrix, Array': function (x, y) {
      // use matrix implementation
      return this(x, matrix(y))
    },

    'SparseMatrix, number | BigNumber': function (x, y) {
      // check scalar
      if (equalScalar(y, 0)) {
        return x.clone()
      }
      return algorithm11(x, y, this, false)
    },

    'DenseMatrix, number | BigNumber': function (x, y) {
      // check scalar
      if (equalScalar(y, 0)) {
        return x.clone()
      }
      return algorithm14(x, y, this, false)
    },

    'number | BigNumber, SparseMatrix': function (x, y) {
      // check scalar
      if (equalScalar(x, 0)) {
        return zeros(y.size(), y.storage())
      }
      return algorithm10(y, x, this, true)
    },

    'number | BigNumber, DenseMatrix': function (x, y) {
      // check scalar
      if (equalScalar(x, 0)) {
        return zeros(y.size(), y.storage())
      }
      return algorithm14(y, x, this, true)
    },

    'Array, number | BigNumber': function (x, y) {
      // use matrix implementation
      return this(matrix(x), y).valueOf()
    },

    'number | BigNumber, Array': function (x, y) {
      // use matrix implementation
      return this(x, matrix(y)).valueOf()
    }
  })
})
