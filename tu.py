from PIL import Image

# 加载图片
img = Image.open("img/sn.jpg")

# 获取当前尺寸
width, height = img.size

# 计算新尺寸，这里我们缩小到50%
new_width = width // 2
new_height = height // 2

# 调整图片尺寸
resized_img = img.resize((new_width, new_height), Image.ANTIALIAS)

# 保存调整后的图片
resized_img.save("img")

