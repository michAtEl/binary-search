module.exports = function(haystack, needle, comparator, low, high) {
  var range = checkRange(haystack, low, high);
  return binarySearchWithoutRangeChecks(haystack, needle, comparator, range.low, range.high);
}

function checkRange(haystack, low, high) {
  if(low === undefined)
    low = 0;

  else {
    low = low|0;
    if(low < 0 || low >= haystack.length)
      throw new RangeError("invalid lower bound");
  }

  if(high === undefined)
    high = haystack.length - 1;

  else {
    high = high|0;
    if(high < low || high >= haystack.length)
      throw new RangeError("invalid upper bound");
  }

  return {
    low: low,
    high: high
  };
}

function binarySearchWithoutRangeChecks(haystack, needle, comparator, low, high) {
  var mid, cmp;

  while(low <= high) {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + (high - low >> 1);
    cmp = +comparator(haystack[mid], needle, mid, haystack);

    /* Too low. */
    if(cmp < 0.0)
      low  = mid + 1;

    /* Too high. */
    else if(cmp > 0.0)
      high = mid - 1;

    /* Key found. */
    else
      return mid;
  }

  /* Key not found. */
  return ~low;
}

module.exports.first = function(haystack, needle, comparator, low, high) {
  var inputRange = checkRange(haystack, low, high);

  // find an index
  var first = binarySearchWithoutRangeChecks(haystack, needle, comparator, inputRange.low, inputRange.high);

  if (first < 0) {
    return first;
  }

  while(first > inputRange.low) {
    var newFirst = binarySearchWithoutRangeChecks(haystack, needle, comparator, inputRange.low, first - 1);
    if (newFirst < 0) {
      // first is the first index of an element that matches comparator
      break;
    } else {
      first = newFirst;
    }
  }

  return first;
}