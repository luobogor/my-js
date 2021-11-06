//    重要：快排、选择排序、希尔排序

{
  console.log('bubbleSort,稳定');

  function bubbleSort(arr) {
    // 至少两个元素才会排序
    if (!Array.isArray(arr) || arr.length < 2) {
      return;
    }

    const result = [...arr]

    for (let i = result.length; i >= 2; i--) {
      for (let j = 1; j < i; j++) {
        if (result[j] < result[j - 1]) {
          [result[j], result[j - 1]] = [result[j - 1], result[j]]
        }
      }
    }

    return result
  }

  const arr = [7, 5, 2, 4, 3, 9];
  const result = bubbleSort(arr); //[2, 3, 4, 5, 7, 9]
  console.log(result);
}

{
  console.log('selectSort,不稳定');

  function selectionSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
      let temp = arr[i]

      for (let j = i + 1; j < len; j++) {
        if (arr[j] < temp) {
          temp = arr[j]
        }
      }

      arr[i] = temp
    }
  }

  const arr = [7, 5, 2, 4, 3, 9];
  selectionSort(arr); //[2, 3, 4, 5, 7, 9]
  console.log(arr);
}

{
  console.log('insertSort');

  function insertSort(arr) {
    let idx = 0;
    const len = arr.length;
    for (let i = 1; i < len; i++) {
      idx = i;
      while (idx > 0) {
        if (arr[idx - 1] > arr[idx]) {
          [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]];
          idx -= 1;
        } else {
          break;
        }
      }
    }
  }

  const arr = [7, 5, 2, 4, 3, 9];
  insertSort(arr); //[2, 3, 4, 5, 7, 9]
  console.log(arr);
}

{
  console.log('shellSort:步长渐小版的insertSort');

  function shellSort(arr) {
    const len = arr.length;
    let feet = len / 2;
    let idx = 0;
    while (feet > 0) {
      for (let i = feet; i < len; i++) {
        idx = i;
        while (idx >= feet) {
          if (arr[idx - feet] > arr[idx]) {
            [arr[idx], arr[idx - feet]] = [arr[idx - feet], arr[idx]];
            idx -= feet;
          } else {
            break;
          }
        }
      }
      feet = Math.floor(feet / 2);
    }
  }

  const arr = [6, 5, 3, 1, 8, 7, 2, 4];
  shellSort(arr);
  console.log(arr);// [1,2,3,4,5,6,7,8]
}

{
  console.log('mergeSort')

  function merge(left, right) {
    let result = [],
      lLen = left.length,
      rLen = right.length,
      l = 0,
      r = 0;
    while (l < lLen && r < rLen) {
      if (left[l] < right[r]) {
        result.push(left[l++]);
      } else {
        result.push(right[r++]);
      }
    }

    // slice API 如果参数超过数组长度返回一个空数组，所以这里无需做判断左边还是右边先消耗完
    return result.concat(left.slice(l)).concat(right.slice(r));
  }

  function mergeSort(arr) {
    const len = arr.length;
    if (len < 2)
      return arr;

    let mid = Math.floor(len / 2),
      left = arr.slice(0, mid),
      right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
  }

  const arr = [7, 5, 2, 4, 3, 9];
  console.log(mergeSort(arr));//[2, 3, 4, 5, 7, 9]
}


{
  console.log('quickSort，不稳定')
  //  "快速排序"的思想很简单，整个排序过程只需要三步：
  //  （1）在数据集之中，选择一个元素作为"基准"（pivot）。
  //  （2）所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
  //  （3）对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。


  function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  function partition(arr, left, right) {
    let pivotIdx = left - 1;
    let idx = left;
    while (idx <= right) {
      if (arr[idx] <= arr[right]) {
        swap(arr, ++pivotIdx, idx);
      }
      idx++;
    }
    return pivotIdx;
  }

  function process(arr, left, right) {
    if (left < right) {
      // 从 [left,right] 之间随机选一个数
      const random = left + Math.floor(Math.random() * (right - left + 1));
      swap(arr, random, right);
      const mid = partition(arr, left, right);
      process(arr, left, mid - 1);
      process(arr, mid + 1, right);
    }
  }

  function quickSort(arr) {
    if (!Array.isArray(arr) || arr.length < 2) {
      return;
    }
    process(arr, 0, arr.length - 1);
  }

  const arr = [7, 5, 2, 7, 4, 3, 9];
  quickSort(arr);
  console.log(arr);
}

{
  console.log('最大 K 数 quickSort 解法')

  function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  function partition(arr, left, right) {
    let pivotIdx = left - 1;
    let idx = left;
    while (idx <= right) {
      if (arr[idx] <= arr[right]) {
        swap(arr, ++pivotIdx, idx);
      }
      idx++;
    }
    return pivotIdx;
  }

  function process(arr, left, right, targetIndex) {
    if (left <= right) {
      // 从 [left,right] 之间随机选一个数
      const random = left + Math.floor(Math.random() * (right - left + 1));
      swap(arr, random, right);
      const mid = partition(arr, left, right);

      if (mid === targetIndex) {
        return arr[mid]
      } else if (mid < targetIndex) {
        return process(arr, mid + 1, right, targetIndex);
      } else {
        return process(arr, left, mid - 1, targetIndex);
      }
    }
  }


  function findKthLargest(arr, k) {
    return process(arr, 0, arr.length - 1, arr.length - k);
  }

  // [ 2, 3, 4, 5, 7, 7, 9 ]

  const arr = [7, 5, 2, 7, 4, 3, 9];
  const result = findKthLargest(arr, 3);
  console.log(result);
}

{
  console.log('二分查找');

  // 时间复杂度 O(logN)
  function binSearch(arr, target) {
    let left = 0
    let right = arr.length - 1
    let mid

    while (left <= right) {
      mid = Math.floor((left + right) / 2)

      if (arr[mid] > target) {
        right = mid - 1
      } else if (arr[mid] < target) {
        left = mid + 1
      } else {
        return mid
      }
    }

    return -1
  }

  const arr = [-1, 0, 3, 5, 9, 12]
  console.log(binSearch(arr, 9)); // 4
}
